import { readFile, readdir } from "fs/promises";
import { open } from "lmdb";
import { resolve } from "path";

export interface Post {
  title: string;
  date: number;
  body?: string;
  image?: string;
}

export type PostEntryKey = [date: number, slug: string];
export interface PostEntryValue {
  title: string;
  body?: string;
  image?: string;
}

export interface PostEntry {
  key: PostEntryKey;
  value: PostEntryValue;
  version?: number;
}

export function getPostDatabase() {
  return open<PostEntryValue, PostEntryKey>({
    path: "posts-db",
  });
}

const postsDirectory = resolve("content", "posts");

export function getPostDirectory(slug: string) {
  return resolve(postsDirectory, slug);
}

export function getPostFilePath(basePath: string) {
  return basePath + "/post.json";
}

export function getPostUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}

export async function getPostCount() {
  const db = getPostDatabase();
  const totalPosts = db.getCount();
  db.close();
  return totalPosts;
}

export async function getPostKeys() {
  const db = getPostDatabase();
  const keys = db.getKeys().asArray;
  db.close();
  return keys;
}

export async function getPosts({
  limit,
  offset,
}: { limit?: number; offset?: number } = {}): Promise<{
  posts: PostEntry[];
  more: boolean;
}> {
  const db = getPostDatabase();
  const posts = db.getRange({ limit, offset, reverse: true }).asArray;
  const totalPosts = db.getCount();
  const more = (offset || 0) + (limit || 0) < totalPosts;
  db.close();
  return { posts, more };
}

export async function getPostBySlug(slug: string) {
  try {
    const postData = JSON.parse(
      String(await readFile(getPostFilePath(getPostDirectory(slug)))),
    );
    return postData;
  } catch (e) {
    throw new Error("Failed to get post");
  }
}

export function getPostIndexEntryValue(post: Post): PostEntryValue {
  const { title, body, image } = post;
  return { title, body, image };
}

export async function reloadPostsDatabase() {
  const db = getPostDatabase();
  await db.drop();
  const postDirectories = await readdir(postsDirectory);
  for (const slug of postDirectories) {
    const postFilePath = getPostFilePath(getPostDirectory(slug));
    const postFileContents = JSON.parse(String(await readFile(postFilePath)));
    const { date } = postFileContents as Post;
    await db.put([date, slug], getPostIndexEntryValue(postFileContents));
  }
  db.close();
}
