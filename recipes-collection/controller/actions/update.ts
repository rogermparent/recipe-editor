"use server";

import { auth, signIn } from "@/auth";
import { rename, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parseRecipeFormData from "../parseFormData";
import { RecipeFormState } from "../formState";
import {
  getRecipeDirectory,
  getRecipeFilePath,
} from "../filesystemDirectories";
import { Recipe } from "../types";
import getRecipeDatabase from "../database";
import buildRecipeIndexValue from "../buildIndexValue";
import createDefaultSlug from "../createSlug";
import slugify from "@sindresorhus/slugify";
import writeRecipeUpload from "../writeUpload";
import getRecipeBySlug from "../data/read";
import { getPlaceholder } from "@/app/lib/placeholders";
import { getPlaiceholder } from "plaiceholder";

export default async function updateRecipe(
  currentDate: number,
  currentSlug: string,
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
      message: "Failed to update Recipe.",
    };
  }

  const {
    date,
    slug,
    name,
    description,
    ingredients,
    instructions,
    image,
    clearImage,
  } = validatedFields.data;

  const currentRecipeDirectory = getRecipeDirectory(currentSlug);
  const currentRecipePath = getRecipeFilePath(currentRecipeDirectory);
  const currentRecipeData = await getRecipeBySlug(currentSlug);

  const finalSlug = slugify(slug || createDefaultSlug(validatedFields.data));
  const finalDate = date || currentDate || Date.now();
  const finalRecipeDirectory = getRecipeDirectory(finalSlug);

  const willRename = currentRecipeDirectory !== finalRecipeDirectory;
  const willChangeDate = currentDate !== finalDate;

  const hasImage = image && image.size > 0;

  const placeholderURL = hasImage
    ? (await getPlaiceholder((await image.arrayBuffer()) as Buffer)).base64
    : clearImage
      ? undefined
      : currentRecipeData.placeholderURL;

  const data: Recipe = {
    name,
    description,
    ingredients,
    instructions,
    image: hasImage
      ? image.name
      : clearImage
        ? undefined
        : currentRecipeData.image,
    placeholderURL,
    date: finalDate,
  };

  if (willRename) {
    await rename(currentRecipeDirectory, finalRecipeDirectory);
    await writeFile(
      `${finalRecipeDirectory}/recipe.json`,
      JSON.stringify(data),
    );
  } else {
    await writeFile(currentRecipePath, JSON.stringify(data));
  }

  if (hasImage) {
    await writeRecipeUpload(finalRecipeDirectory, image);
  }

  const db = getRecipeDatabase();

  try {
    if (willRename || willChangeDate) {
      db.remove([currentDate, currentSlug]);
    }
    db.put([finalDate, finalSlug], buildRecipeIndexValue(data));
  } catch (e) {
    return { message: "Failed to write recipe to index" };
  } finally {
    db.close();
  }
  if (willRename) {
    revalidatePath("/recipe/" + currentSlug);
  }
  revalidatePath("/recipe/" + finalSlug);
  revalidatePath("/");
  redirect("/recipe/" + finalSlug);
}
