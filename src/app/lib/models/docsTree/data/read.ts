import { readFile } from "fs/promises";
import { docsTreeFilePath } from "../filesystemDirectories";
import { DocsTree } from "../types";

export default async function getDocsTree() {
  const docsTreeData = JSON.parse(
    String(await readFile(docsTreeFilePath)),
  ) as DocsTree;
  return docsTreeData;
}
