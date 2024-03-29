import { decodeHTML } from "entities";
import { Instruction, InstructionGroup, Recipe } from "../controller/types";
import { createIngredients } from "./parseIngredients";

interface RecipeLD {
  name: string;
  description: string;
  recipeIngredient: string[];
  recipeInstructions: {
    text?: string;
    itemListElement: { name?: string; text?: string }[];
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

function findRecipeObjectInText(text: string): RecipeLD | undefined {
  const jsonLDRegex = /<script.*?ld\+json.*?>([\s\S]*?)<\/script>/gm;

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

function createStep({
  name,
  text = "",
}: {
  name?: string;
  text?: string;
}): Instruction {
  return {
    name: name && (name === text ? undefined : decodeHTML(name)),
    text: decodeHTML(text),
  };
}

export async function importRecipeData(
  url: string,
): Promise<Partial<Recipe> | undefined> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  const text = await response.text();
  const recipeObject = findRecipeObjectInText(text);
  if (recipeObject) {
    const { name, description, recipeIngredient, recipeInstructions } =
      recipeObject;

    const newDescriptionSegments = [`*Imported from [${url}](${url})*`];
    if (description) {
      newDescriptionSegments.push(`\n\n---\n\n${description}`);
    }

    const newDescription = newDescriptionSegments.join("");
    const massagedData = {
      name,
      description: newDescription,
      ingredients: recipeIngredient?.map((ingredientString) => {
        const [massagedIngredient] = createIngredients(ingredientString);
        return massagedIngredient;
      }),
      instructions: recipeInstructions?.map((entry) => {
        if ("itemListElement" in entry) {
          const { name, itemListElement } = entry;
          return {
            name,
            instructions: itemListElement.map(createStep),
          } as InstructionGroup;
        } else {
          return createStep(entry);
        }
      }),
    };
    return massagedData;
  }
  return undefined;
}
