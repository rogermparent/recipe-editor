import { readdir } from "node:fs/promises";
import { menusBaseDirectory } from "../filesystemDirectories";
import getMenuBySlug from "./read";
import { join } from "node:path";
import { Menu } from "../types";

export interface MassagedMenuEntry extends Menu {
  slug: string;
}

export interface ReadMenuIndexResult {
  menus: MassagedMenuEntry[];
}

async function getMassagedMenu(slug: string): Promise<MassagedMenuEntry> {
  const menuData = await getMenuBySlug(slug);
  return { ...menuData, slug };
}

async function collectMenuPromises(
  base: string,
  dir: string = "",
  menuPromises: Promise<MassagedMenuEntry>[] = [],
) {
  const dirContents = await readdir(join(base, dir), { withFileTypes: true });
  for (const item of dirContents) {
    if (item.isDirectory()) {
      await collectMenuPromises(base, join(dir, item.name), menuPromises);
    } else if (item.name === "menu.json") {
      menuPromises.push(getMassagedMenu(dir));
    }
  }
  return menuPromises;
}

export default async function getMenus(): Promise<ReadMenuIndexResult> {
  const menuPromises = await collectMenuPromises(menusBaseDirectory);
  const menus = await Promise.all(menuPromises);
  return { menus };
}
