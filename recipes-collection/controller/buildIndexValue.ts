import { Recipe, RecipeEntryValue } from "./types";

export default function buildRecipeIndexValue(
  recipe: Recipe,
): RecipeEntryValue {
  const { name, image, ingredients } = recipe;
  return {
    name,
    image,
    ingredients: ingredients?.map(({ quantity, unit, ingredient }) =>
      [quantity, unit, ingredient].join(" "),
    ),
  };
}
