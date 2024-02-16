import {
  getRecipeDirectory,
  getRecipeUploadsDirectory,
} from "recipes-collection/controller/filesystemDirectories";
import { resolve } from "path";
import { getPlaiceholder } from "plaiceholder";
import { readFile } from "fs/promises";

export async function getPlaceholder(slug: string, image: string) {
  const uploadFilePath = resolve(
    getRecipeUploadsDirectory(getRecipeDirectory(slug)),
    image,
  );
  try {
    const { base64 } = await getPlaiceholder(await readFile(uploadFilePath));
    return base64;
  } catch (e) {
    return undefined;
  }
}
