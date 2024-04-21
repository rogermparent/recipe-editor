import { resolve } from "path";

export function getContentDirectory() {
  return process.env.CONTENT_DIRECTORY || resolve("content");
}

export const contentDirectory = getContentDirectory();
