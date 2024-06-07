"use server";

import { rm } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getRecipeDatabase from "../database";
import { getRecipeDirectory } from "../filesystemDirectories";
import { commitChanges } from "content-engine/git/commit";

export default async function deleteRecipe(date: number, slug: string) {
  const db = getRecipeDatabase();
  const recipeDirectory = getRecipeDirectory(slug);
  try {
    await rm(recipeDirectory, { recursive: true });
    await commitChanges("delete", slug); // Commit changes to Git with action and slug
    await db.remove([date, slug]);
    revalidatePath("/recipe/" + slug);
    revalidatePath("/");
    redirect("/");
  } catch (e) {
    throw e;
  } finally {
    db.close();
  }
}
