import { resolve } from "path";

export const contentDirectory =
  process.env.CONTENT_DIRECTORY || resolve("content");

export const postsBaseDirectory = resolve(contentDirectory, "posts");

export const postDataDirectory = resolve(postsBaseDirectory, "data");
export const postIndexDirectory = resolve(postsBaseDirectory, "index");

export function getContentDirectory() {
  return contentDirectory;
}

export function getPostDirectory(slug: string) {
  return resolve(postDataDirectory, slug);
}

export function getPostFilePath(basePath: string) {
  return basePath + "/post.json";
}

export function getPostUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}
