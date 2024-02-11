import { parseIngredient } from "parse-ingredient";
import { Ingredient } from "@/collections/recipes/controller/types";
import { formatQuantity } from "format-quantity";

export function createIngredients(input: string) {
  return parseIngredient(input).map(
    ({ quantity, unitOfMeasure, description }) => {
      const formattedQuantity = quantity ? formatQuantity(quantity) : undefined;
      const massagedIngredient: Ingredient = {
        quantity: formattedQuantity || undefined,
        unit: unitOfMeasure || undefined,
        ingredient: description,
      };
      return massagedIngredient;
    },
  );
}
