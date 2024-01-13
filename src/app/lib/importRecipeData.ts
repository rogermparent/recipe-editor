import { Recipe } from "./models/recipes/types";

interface RecipeLD {
  name: string;
  description: string;
  recipeIngredient: string[];
  recipeInstructions: {
    text?: string;
    itemListElement: { text?: string }[];
    name?: string;
  }[];
}

type UnknownLD = Record<string, unknown> | UnknownLD[] | RecipeLD;

const findRecipeInObject = (jsonLDObject: UnknownLD): RecipeLD | undefined => {
  if (Array.isArray(jsonLDObject)) {
    for (const childObject of jsonLDObject) {
      const foundRecipe = findRecipeInObject(childObject);
      if (foundRecipe) {
        return foundRecipe;
      }
    }
  } else {
    if (jsonLDObject && typeof jsonLDObject === "object") {
      if ("@type" in jsonLDObject) {
        const ldType = jsonLDObject["@type"];
        const isRecipe =
          ldType &&
          (Array.isArray(ldType)
            ? ldType.findIndex((typeString) => typeString === "Recipe") !== -1
            : ldType === "Recipe");
        if (isRecipe) {
          return jsonLDObject as unknown as RecipeLD;
        }
      }
      return findRecipeInObject(Object.values(jsonLDObject) as UnknownLD);
    }
  }
};

const jsonLDRegex = /<script.*?ld\+json.*?>([\s\S]*?)<\/script>/gm;

function findRecipeObjectInText(text: string): RecipeLD | undefined {
  let jsonLDTextSearch;
  while ((jsonLDTextSearch = jsonLDRegex.exec(text)) !== null) {
    const jsonLDTextMatch = jsonLDTextSearch?.[1];
    if (jsonLDTextMatch) {
      const jsonLDObject: UnknownLD = JSON.parse(jsonLDTextMatch);
      const foundRecipe = findRecipeInObject(jsonLDObject);
      if (foundRecipe) {
        return foundRecipe;
      }
    }
  }
}

export async function importRecipeData(
  url: string,
): Promise<Partial<Recipe> | undefined> {
  const response = await fetch(url);
  const text = await response.text();
  const recipeObject = findRecipeObjectInText(text);
  if (recipeObject) {
    const { name, description, recipeIngredient, recipeInstructions } =
      recipeObject;
    const massagedData = {
      name,
      description,
      ingredients: recipeIngredient?.map((ingredient) => ({
        ingredient,
      })),
      instructions: recipeInstructions?.map(
        ({ name, text, itemListElement }) => {
          return {
            name: name === text ? undefined : name,
            text:
              text ||
              (itemListElement?.length === 1
                ? itemListElement[0].text
                : itemListElement
                    .map(({ text }) => `* ${text}`)
                    .join("\n\n")) ||
              "",
          };
        },
      ),
    };
    return massagedData;
  }
  return undefined;
}
