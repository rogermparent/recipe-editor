import { readFile, readdir } from "fs/promises";
import { open } from "lmdb";
import { resolve } from "path";

export interface Post {
  title: string;
  body: string;
  date: number;
}

export type PostEntryKey = [date: number, slug: string];
export interface PostEntryValue {
  title: string;
  body?: string;
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

export function getPostDirectory(id: string) {
  return resolve(postsDirectory, id);
}

export function getPostPath(id: string) {
  return getPostDirectory(id) + "/post.json";
}

export async function getFrontPagePosts({}) {}

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

export async function getPostBySlug(id: string) {
  try {
    const postData = JSON.parse(String(await readFile(getPostPath(id))));
    return postData;
  } catch (e) {
    return { message: "Failed to fetch post" };
  }
}

export async function resetPostsDatabase() {
  const db = getPostDatabase();
  await db.drop();
  const postDirectories = await readdir(postsDirectory);
  for (const slug of postDirectories) {
    const postFileContents = JSON.parse(
      String(await readFile(getPostPath(slug))),
    );
    const { title, body, date } = postFileContents as Post;
    await db.put([date, slug], { title, body });
  }
  db.close();
}
