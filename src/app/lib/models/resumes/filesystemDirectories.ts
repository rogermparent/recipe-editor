import { resolve } from "path";

export const contentDirectory =
  process.env.CONTENT_DIRECTORY || resolve("content");

export const resumesBaseDirectory = resolve(contentDirectory, "resumes");

export const resumeDataDirectory = resolve(resumesBaseDirectory, "data");
export const resumeIndexDirectory = resolve(resumesBaseDirectory, "index");

export function getContentDirectory() {
  return contentDirectory;
}

export function getResumeDirectory(slug: string) {
  return resolve(resumeDataDirectory, slug);
}

export function getResumeFilePath(basePath: string) {
  return basePath + "/resume.json";
}

export function getResumeUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}
