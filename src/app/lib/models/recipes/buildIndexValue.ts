import { Recipe, RecipeEntryValue } from "./types";

export default function buildRecipeIndexValue(
  recipe: Recipe,
): RecipeEntryValue {
  const { name, image } = recipe;
  return { name, image };
}
