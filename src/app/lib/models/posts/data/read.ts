import { readFile } from "fs/promises";
import { getPostDirectory, getPostFilePath } from "../filesystemDirectories";

export default async function getPostBySlug(slug: string) {
  const postData = JSON.parse(
    String(await readFile(getPostFilePath(getPostDirectory(slug)))),
  );
  return postData;
}
