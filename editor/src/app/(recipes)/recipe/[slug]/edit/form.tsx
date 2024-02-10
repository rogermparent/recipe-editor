"use client";

import UpdateRecipeFields from "@/collections/recipes/components/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Recipe } from "@/collections/recipes/controller/types";
import { RecipeFormState } from "@/collections/recipes/controller/formState";
import updateRecipe from "@/collections/recipes/controller/actions/update";

export default function EditRecipeForm({
  recipe,
  slug,
}: {
  slug: string;
  recipe: Recipe;
}) {
  const { date } = recipe;
  const initialState = { message: "", errors: {} } as RecipeFormState;
  const updateThisRecipe = updateRecipe.bind(null, date, slug);
  const [state, dispatch] = useFormState(updateThisRecipe, initialState);
  return (
    <form
      id="recipe-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <UpdateRecipeFields recipe={recipe} slug={slug} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
