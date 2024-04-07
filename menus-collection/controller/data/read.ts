import { readFile } from "fs/promises";
import { getMenuDirectory, getMenuFilePath } from "../filesystemDirectories";
import { Menu } from "../types";

export default async function getMenuBySlug(
  slug: string,
): Promise<Menu | undefined> {
  try {
    const menuData = JSON.parse(
      String(await readFile(getMenuFilePath(getMenuDirectory(slug)))),
    );
    return menuData;
  } catch (e) {
    if ((e as { code?: string }).code === "ENOENT") {
      return undefined;
    }
    throw e;
  }
}
