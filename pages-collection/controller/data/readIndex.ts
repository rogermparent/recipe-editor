import { readdir } from "node:fs/promises";
import { pagesBaseDirectory } from "../filesystemDirectories";
import getPageBySlug from "./read";
import { join } from "node:path";

export interface MassagedPageEntry {
  date: number;
  slug: string;
  name: string;
  content: string;
}

export interface ReadPageIndexResult {
  pages: MassagedPageEntry[];
}

async function getMassagedPage(slug: string): Promise<MassagedPageEntry> {
  const pageData = await getPageBySlug(slug);
  return { ...pageData, slug };
}

async function collectPagePromises(
  base: string,
  dir: string = "",
  pagePromises: Promise<MassagedPageEntry>[] = [],
) {
  const dirContents = await readdir(join(base, dir), { withFileTypes: true });
  for (const item of dirContents) {
    if (item.isDirectory()) {
      await collectPagePromises(base, join(dir, item.name), pagePromises);
    } else if (item.name === "page.json") {
      pagePromises.push(getMassagedPage(dir));
    }
  }
  return pagePromises;
}

export default async function getPages(): Promise<ReadPageIndexResult> {
  const pagePromises = await collectPagePromises(pagesBaseDirectory);
  const pages = await Promise.all(pagePromises);
  return { pages };
}
