"use server";

import { rename, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parseMenuFormData from "../parseFormData";
import { MenuFormState } from "../formState";
import { getMenuDirectory, getMenuFilePath } from "../filesystemDirectories";
import { Menu } from "../types";
import createDefaultSlug from "../createSlug";
import slugify from "@sindresorhus/slugify";

export default async function updateMenu(
  currentSlug: string,
  _prevState: MenuFormState,
  formData: FormData,
) {
  const validatedFields = parseMenuFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update Menu.",
    };
  }

  const { slug, name, items } = validatedFields.data;

  const currentMenuDirectory = getMenuDirectory(currentSlug);
  const currentMenuPath = getMenuFilePath(currentMenuDirectory);

  const finalSlug = slugify(slug || createDefaultSlug(validatedFields.data));
  const finalMenuDirectory = getMenuDirectory(finalSlug);

  const willRename = currentMenuDirectory !== finalMenuDirectory;

  const data: Menu = {
    name,
    items,
  };

  if (willRename) {
    await rename(currentMenuDirectory, finalMenuDirectory);
    await writeFile(`${finalMenuDirectory}/menu.json`, JSON.stringify(data));
  } else {
    await writeFile(currentMenuPath, JSON.stringify(data));
  }

  if (willRename) {
    revalidatePath("/" + currentSlug);
  }
  revalidatePath("/" + finalSlug);
  redirect("/menus");
}
