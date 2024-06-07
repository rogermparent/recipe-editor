"use server";

import parseRecipeFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RecipeFormState } from "../formState";
import { Recipe } from "../types";
import { getRecipeDirectory } from "../filesystemDirectories";
import getRecipeDatabase from "../database";
import buildRecipeIndexValue from "../buildIndexValue";
import createDefaultSlug from "../createSlug";
import writeRecipeFiles, { getRecipeFileInfo } from "../writeUpload";
import { outputJson } from "fs-extra";
import { join } from "path";
import { commitChanges } from "content-engine/git/commit";

export default async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
) {
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
    ingredients,
    instructions,
  } = validatedFields.data;

  const date: number = givenDate || (Date.now() as number);
  const slug = slugify(givenSlug || createDefaultSlug(validatedFields.data));

  const imageData = await getRecipeFileInfo(validatedFields.data);
  const { imageName } = imageData;

  const data: Recipe = {
    name,
    description,
    ingredients,
    instructions,
    image: imageName,
    date,
  };

  const baseDirectory = getRecipeDirectory(slug);

  await outputJson(join(baseDirectory, "recipe.json"), data);

  await writeRecipeFiles(baseDirectory, imageData);
  await commitChanges(baseDirectory, name); // Commit changes to Git with recipe name

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
