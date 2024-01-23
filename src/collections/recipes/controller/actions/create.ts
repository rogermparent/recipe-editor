"use server";

import { auth, signIn } from "@/auth";
import parseRecipeFormData from "@/collections/recipes/controller/parseFormData";
import slugify from "@sindresorhus/slugify";
import { mkdirIfNotPresent } from "@/app/lib/util";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RecipeFormState } from "../formState";
import { Recipe } from "../types";
import {
  getRecipeDirectory,
  getRecipeFilePath,
} from "../filesystemDirectories";
import getRecipeDatabase from "../database";
import buildRecipeIndexValue from "../buildIndexValue";
import createDefaultSlug from "../createSlug";
import writeRecipeUpload from "../writeUpload";

export default async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parseRecipeFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Recipe.",
    };
  }

  const {
    date: givenDate,
    slug: givenSlug,
    name,
    description,
    image,
    ingredients,
    instructions,
  } = validatedFields.data;

  const date: number = givenDate || (Date.now() as number);
  const slug = slugify(givenSlug || createDefaultSlug(validatedFields.data));
  const hasImage = image && image.size > 0;
  const data: Recipe = {
    name,
    description,
    ingredients,
    instructions,
    image: hasImage ? image.name : undefined,
    date,
  };
  const recipeBaseDirectory = getRecipeDirectory(slug);
  await mkdirIfNotPresent(recipeBaseDirectory);
  await writeFile(getRecipeFilePath(recipeBaseDirectory), JSON.stringify(data));
  if (hasImage) {
    await writeRecipeUpload(recipeBaseDirectory, image);
  }
  const db = getRecipeDatabase();
  try {
    await db.put([date, slug], buildRecipeIndexValue(data));
  } catch (e) {
    return { message: "Failed to write recipe" };
  } finally {
    db.close();
  }
  revalidatePath("/recipe/" + slug);
  revalidatePath("/recipes");
  revalidatePath("/recipes/[page]", "page");
  revalidatePath("/");
  redirect("/recipe/" + slug);
}
