import { RootDatabase, open } from "lmdb";
import { recipeIndexDirectory } from "./filesystemDirectories";
import { RecipeEntryKey, RecipeEntryValue } from "./types";

let globalDb: RootDatabase<RecipeEntryValue, RecipeEntryKey>;

export default function getRecipeDatabase() {
  if (!globalDb) {
    const db = open<RecipeEntryValue, RecipeEntryKey>({
      path: recipeIndexDirectory,
    });
    globalDb = db;
  }
  return globalDb;
}
