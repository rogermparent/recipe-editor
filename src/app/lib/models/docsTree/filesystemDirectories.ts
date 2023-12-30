import { resolve } from "path";

export const contentDirectory =
  process.env.CONTENT_DIRECTORY || resolve("content");

export const docsTreeBaseDirectory = resolve(contentDirectory, "docsTree");

export const docsTreeFilePath = resolve(docsTreeBaseDirectory, "tree.json");
