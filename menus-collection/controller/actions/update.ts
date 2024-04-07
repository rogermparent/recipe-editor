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
import { ensureDir } from "fs-extra";

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

  const { items } = validatedFields.data;

  const currentMenuDirectory = getMenuDirectory(currentSlug);
  const currentMenuPath = getMenuFilePath(currentMenuDirectory);

  const data: Menu = {
    items,
  };

  await ensureDir(currentMenuDirectory);
  await writeFile(currentMenuPath, JSON.stringify(data));

  revalidatePath("/" + currentSlug);
  redirect("/menus");
}
