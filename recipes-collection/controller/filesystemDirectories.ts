import { resolve } from "path";

export const contentDirectory =
  process.env.CONTENT_DIRECTORY || resolve("content");

export const recipesBaseDirectory = resolve(contentDirectory, "recipes");

export const recipeDataDirectory = resolve(recipesBaseDirectory, "data");
export const recipeIndexDirectory = resolve(recipesBaseDirectory, "index");

export function getContentDirectory() {
  return contentDirectory;
}

export function getRecipeDirectory(slug: string) {
  return resolve(recipeDataDirectory, slug);
}

export function getRecipeFilePath(basePath: string) {
  return basePath + "/recipe.json";
}

export function getRecipeUploadsDirectory(basePath: string) {
  return basePath + "/uploads";
}
