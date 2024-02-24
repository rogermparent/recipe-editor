"use server";

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
import writeRecipeFiles, { getRecipeFileInfo } from "../writeUpload";
import getRecipeBySlug from "../data/read";

export default async function updateRecipe(
  currentDate: number,
  currentSlug: string,
  _prevState: RecipeFormState,
  formData: FormData,
) {
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

  const imageData = await getRecipeFileInfo(
    validatedFields.data,
    currentRecipeData,
  );
  const { imageName } = imageData;

  const data: Recipe = {
    name,
    description,
    ingredients,
    instructions,
    image: imageName || (clearImage ? undefined : currentRecipeData.imageName),
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

  await writeRecipeFiles(finalRecipeDirectory, imageData);

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
