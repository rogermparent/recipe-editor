import { open } from "lmdb";
import { postIndexDirectory } from "./filesystemDirectories";
import { PostEntryKey, PostEntryValue } from "./types";

export default function getPostDatabase() {
  return open<PostEntryValue, PostEntryKey>({
    path: postIndexDirectory,
  });
}
