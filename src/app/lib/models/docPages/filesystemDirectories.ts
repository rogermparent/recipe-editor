import { resolve } from "path";

export const contentDirectory =
  process.env.CONTENT_DIRECTORY || resolve("content");

export const docPagesBaseDirectory = resolve(contentDirectory, "docPages");

export const docPageDataDirectory = resolve(docPagesBaseDirectory, "data");
export const docPageIndexDirectory = resolve(docPagesBaseDirectory, "index");

export function getContentDirectory() {
  return contentDirectory;
}

export function getDocPageDirectory(slug: string) {
  return resolve(docPageDataDirectory, slug);
}

export function getDocPageFilePath(basePath: string) {
  return basePath + "/docPage.json";
}

export function getDocPageUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}
