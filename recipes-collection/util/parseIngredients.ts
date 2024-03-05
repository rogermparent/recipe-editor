import { parseIngredient } from "parse-ingredient";
import { Ingredient } from "../controller/types";
import { formatQuantity } from "format-quantity";

export function createIngredients(input: string) {
  return parseIngredient(input).map(
    ({ quantity, unitOfMeasure, description }) => {
      const ingredientStringSegments = [];

      if (quantity) {
        const formattedQuantity = formatQuantity(quantity);
        if (formattedQuantity) {
          ingredientStringSegments.push(
            `<Multiplyable baseNumber="${formattedQuantity}" />`,
          );
        } else {
          ingredientStringSegments.push(quantity);
        }
      }

      if (unitOfMeasure) {
        ingredientStringSegments.push(unitOfMeasure);
      }

      if (description) {
        ingredientStringSegments.push(description);
      }

      const massagedIngredient: Ingredient = {
        ingredient: ingredientStringSegments.join(" "),
      };
      return massagedIngredient;
    },
  );
}
