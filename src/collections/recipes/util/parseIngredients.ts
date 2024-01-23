import { parseIngredient } from "parse-ingredient";
import { Ingredient } from "@/collections/recipes/controller/types";

export function createIngredients(input: string) {
  return parseIngredient(input).map(
    ({ quantity, unitOfMeasure, description }) => {
      const massagedIngredient: Ingredient = {
        quantity: quantity ? String(quantity) : undefined,
        unit: unitOfMeasure || undefined,
        ingredient: description,
      };
      return massagedIngredient;
    },
  );
}
