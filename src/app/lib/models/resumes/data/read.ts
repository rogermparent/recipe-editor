import { readFile } from "fs/promises";
import { getResumeDirectory, getResumeFilePath } from "../filesystemDirectories";

export default async function getResumeBySlug(slug: string) {
  const resumeData = JSON.parse(
    String(await readFile(getResumeFilePath(getResumeDirectory(slug)))),
  );
  return resumeData;
}
