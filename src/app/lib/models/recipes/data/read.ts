import { readFile } from "fs/promises";
import {
  getRecipeDirectory,
  getRecipeFilePath,
} from "../filesystemDirectories";

export default async function getRecipeBySlug(slug: string) {
  const recipeData = JSON.parse(
    String(await readFile(getRecipeFilePath(getRecipeDirectory(slug)))),
  );
  return recipeData;
}
