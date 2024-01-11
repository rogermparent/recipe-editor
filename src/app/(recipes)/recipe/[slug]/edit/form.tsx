"use client";

import UpdateRecipeFields from "@/components/Recipe/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Recipe } from "@/app/lib/models/recipes/types";
import { RecipeFormState } from "@/app/lib/models/recipes/formState";
import updateRecipe from "@/app/lib/models/recipes/actions/update";

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
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <UpdateRecipeFields recipe={recipe} slug={slug} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
