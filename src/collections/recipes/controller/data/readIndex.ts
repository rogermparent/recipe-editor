import getRecipeDatabase from "../database";
import { RecipeEntry } from "../types";

export default async function getRecipes({
  limit,
  offset,
}: { limit?: number; offset?: number } = {}): Promise<{
  recipes: RecipeEntry[];
  more: boolean;
}> {
  const db = getRecipeDatabase();
  const recipes = db.getRange({ limit, offset, reverse: true }).asArray;
  const totalRecipes = db.getCount();
  const more = (offset || 0) + (limit || 0) < totalRecipes;
  db.close();
  return { recipes, more };
}
