import  getPostDatabase  from "../database";
import { PostEntry } from "../types";

export default async function getPosts({
  limit,
  offset,
}: { limit?: number; offset?: number } = {}): Promise<{
  posts: PostEntry[];
  more: boolean;
}> {
  const db = getPostDatabase();
  const posts = db.getRange({ limit, offset, reverse: true }).asArray;
  const totalPosts = db.getCount();
  const more = (offset || 0) + (limit || 0) < totalPosts;
  db.close();
  return { posts, more };
}
