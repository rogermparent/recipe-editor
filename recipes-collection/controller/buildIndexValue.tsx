import { Recipe, RecipeEntryValue } from "./types";
import { compiler } from "markdown-to-jsx";

function flattenMarkdown(input: string): string {
  const compiled = compiler(input, { wrapper: null }) as unknown as (
    | string
    | { type: "Multiplyable"; props: { baseNumber: string | number } }
  )[];

  const flattened = compiled.reduce<string>((acc, cur) => {
    if (typeof cur === "string") {
      return acc.concat(cur);
    }
    if (cur.type === "Multiplyable") {
      return acc.concat(String(cur.props.baseNumber));
    }
    return acc;
  }, "");

  console.log({ flattened });

  return flattened;
}

export default function buildRecipeIndexValue(
  recipe: Recipe,
): RecipeEntryValue {
  const { name, image, ingredients } = recipe;
  return {
    name,
    image,
    ingredients: ingredients?.map(({ ingredient }) => {
      return flattenMarkdown(ingredient);
    }),
  };
}
