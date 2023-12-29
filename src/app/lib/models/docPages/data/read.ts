import { readFile } from "fs/promises";
import {
  getDocPageDirectory,
  getDocPageFilePath,
} from "../filesystemDirectories";

export default async function getDocPageBySlug(slug: string) {
  const docPageData = JSON.parse(
    String(await readFile(getDocPageFilePath(getDocPageDirectory(slug)))),
  );
  return docPageData;
}
