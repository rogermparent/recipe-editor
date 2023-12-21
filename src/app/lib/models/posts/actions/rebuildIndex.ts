"use server";

import { readFile, readdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import getPostDatabase from "../database";
import {
  getPostDirectory,
  getPostFilePath,
  postDataDirectory,
} from "../filesystemDirectories";
import { Post } from "../types";
import buildPostIndexValue from "../buildIndexValue";

export default async function rebuildPostIndex() {
  const db = getPostDatabase();
  await db.drop();
  try {
    const postDirectories = await readdir(postDataDirectory);
    for (const slug of postDirectories) {
      const postFilePath = getPostFilePath(getPostDirectory(slug));
      const postFileContents = JSON.parse(String(await readFile(postFilePath)));
      const { date } = postFileContents as Post;
      await db.put([date, slug], buildPostIndexValue(postFileContents));
    }
  } catch (e) {}
  db.close();
  revalidatePath("/");
}
