import { readFile } from "fs/promises";
import { getMenuDirectory, getMenuFilePath } from "../filesystemDirectories";
import { Menu } from "../types";

export async function getMenuBySlug(slug: string): Promise<Menu> {
  const menuData = JSON.parse(
    String(await readFile(getMenuFilePath(getMenuDirectory(slug)))),
  );
  return menuData;
}

export default async function safeGetMenuBySlug(
  slug: string,
): Promise<Menu | undefined> {
  try {
    return getMenuBySlug(slug);
  } catch (e) {
    if ((e as { code?: string }).code === "ENOENT") {
      return undefined;
    }
    throw e;
  }
}
