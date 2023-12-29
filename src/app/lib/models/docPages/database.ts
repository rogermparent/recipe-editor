import { open } from "lmdb";
import { docPageIndexDirectory } from "./filesystemDirectories";
import { DocPageEntryKey, DocPageEntryValue } from "./types";

export default function getDocPageDatabase() {
  return open<DocPageEntryValue, DocPageEntryKey>({
    path: docPageIndexDirectory,
  });
}
