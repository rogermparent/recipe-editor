import type { Ingredient } from "../controller/types";

export function createIngredients(input: string) {
  return input
    .split(/\n+/)
    .map((inputLine) => {
      const trimmedInputLine = inputLine
        .trim()
        .normalize("NFKD")
        .replaceAll("⁄", "/");
      if (trimmedInputLine) {
        const multiplyableIngredient = trimmedInputLine.replace(
          /[0-9]+(?:\/[0-9]+|(?: and)? [0-9]+\/[0-9]+|\.[0-9]+)?/g,
          (match) => {
            const normalizedMatch = match.replace(" and", "");
            return `<Multiplyable baseNumber="${normalizedMatch}" />`;
          },
        );
        return { ingredient: multiplyableIngredient };
      }
    })
    .filter(Boolean) as Ingredient[];
}
