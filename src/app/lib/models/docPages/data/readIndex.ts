import getDocPageDatabase from "../database";
import { DocPageEntry } from "../types";

export default async function getDocPages({
  limit,
  offset,
}: { limit?: number; offset?: number } = {}): Promise<{
  docPages: DocPageEntry[];
  more: boolean;
}> {
  const db = getDocPageDatabase();
  const docPages = db.getRange({ limit, offset, reverse: true }).asArray;
  const totalDocPages = db.getCount();
  const more = (offset || 0) + (limit || 0) < totalDocPages;
  db.close();
  return { docPages, more };
}
