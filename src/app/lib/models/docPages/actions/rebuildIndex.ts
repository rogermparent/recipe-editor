"use server";

import { readFile, readdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import getDocPageDatabase from "../database";
import {
  getDocPageDirectory,
  getDocPageFilePath,
  docPageDataDirectory,
} from "../filesystemDirectories";
import { DocPage } from "../types";
import buildDocPageIndexValue from "../buildIndexValue";

export default async function rebuildDocPageIndex() {
  const db = getDocPageDatabase();
  await db.drop();
  try {
    const docPageDirectories = await readdir(docPageDataDirectory);
    for (const slug of docPageDirectories) {
      const docPageFilePath = getDocPageFilePath(getDocPageDirectory(slug));
      const docPageFileContents = JSON.parse(
        String(await readFile(docPageFilePath)),
      );
      const { date } = docPageFileContents as DocPage;
      await db.put([date, slug], buildDocPageIndexValue(docPageFileContents));
    }
  } catch (e) {}
  db.close();
  revalidatePath("/");
}
