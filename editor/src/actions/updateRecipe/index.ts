"use server";

import { auth, signIn } from "@/auth";
import updateRecipe from "recipes-collection/controller/actions/update";
import { RecipeFormState } from "recipes-collection/controller/formState";

export default async function authenticateAndUpdateRecipe(
  currentDate: number,
  currentSlug: string,
  _prevState: RecipeFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }
  return updateRecipe(currentDate, currentSlug, _prevState, formData);
}
