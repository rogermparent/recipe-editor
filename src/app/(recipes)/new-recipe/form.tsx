"use client";

import CreateRecipeFields from "@/collections/recipes/components/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { RecipeFormState } from "@/collections/recipes/controller/formState";
import createRecipe from "@/collections/recipes/controller/actions/create";
import { Recipe } from "@/collections/recipes/controller/types";

export default function NewRecipeForm({
  slug,
  recipe,
}: {
  slug?: string;
  recipe?: Partial<Recipe>;
}) {
  const initialState = { message: "", errors: {} } as RecipeFormState;
  const [state, dispatch] = useFormState(createRecipe, initialState);
  return (
    <form id="recipe-form" className="m-2 w-full" action={dispatch}>
      <h2 className="font-bold text-2xl mb-2">New Recipe</h2>
      <div className="flex flex-col flex-nowrap">
        <CreateRecipeFields state={state} slug={slug} recipe={recipe} />
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
      </div>
    </form>
  );
}
