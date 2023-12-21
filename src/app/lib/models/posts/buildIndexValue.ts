import { Post, PostEntryValue } from "./types";

export default function buildPostIndexValue(post: Post): PostEntryValue {
  const { title, summary, image } = post;
  return { title, summary, image };
}
