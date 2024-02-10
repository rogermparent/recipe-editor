import { Recipe, RecipeEntryValue } from "./types";

export default function buildRecipeIndexValue(
  recipe: Recipe,
): RecipeEntryValue {
  const { name, image, placeholderURL, ingredients } = recipe;
  return {
    name,
    image,
    placeholderURL,
    ingredients: ingredients?.map(({ quantity, unit, ingredient }) =>
      [quantity, unit, ingredient].join(" "),
    ),
  };
}
