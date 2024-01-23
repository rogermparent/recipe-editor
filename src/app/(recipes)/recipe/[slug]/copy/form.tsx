"use client";

import UpdateRecipeFields from "@/collections/recipes/components/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Recipe } from "@/collections/recipes/controller/types";
import { RecipeFormState } from "@/collections/recipes/controller/formState";
import createRecipe from "@/collections/recipes/controller/actions/create";

export default function CopyRecipeForm({ recipe }: { recipe: Recipe }) {
  const initialState = { message: "", errors: {} } as RecipeFormState;
  const [state, dispatch] = useFormState(createRecipe, initialState);
  const { name, date, ...cleanedRecipe } = recipe;
  return (
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <UpdateRecipeFields recipe={cleanedRecipe} state={state} />
      <div id="missing-fields-error" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
      <div className="my-1">
        <Button type="submit">
          <span>Submit</span>
        </Button>
      </div>
    </form>
  );
}
