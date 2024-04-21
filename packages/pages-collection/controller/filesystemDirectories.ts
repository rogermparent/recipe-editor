import { resolve } from "path";

import { contentDirectory } from "content-engine/fs/getContentDirectory";

export const pagesBaseDirectory = resolve(contentDirectory, "pages");

export function getPageDirectory(slug: string) {
  return resolve(pagesBaseDirectory, slug);
}

export function getPageFilePath(basePath: string) {
  return basePath + "/page.json";
}

export function getPageUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}
