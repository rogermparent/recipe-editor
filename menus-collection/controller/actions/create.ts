"use server";

import parseMenuFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MenuFormState } from "../formState";
import { Menu } from "../types";
import { getMenuDirectory, getMenuFilePath } from "../filesystemDirectories";
import createDefaultSlug from "../createSlug";
import { ensureDir } from "fs-extra";

export default async function createMenu(
  _prevState: MenuFormState,
  formData: FormData,
) {
  const validatedFields = parseMenuFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Menu.",
    };
  }

  const { slug: givenSlug, name, items } = validatedFields.data;

  const slug = slugify(givenSlug || createDefaultSlug(validatedFields.data));

  const data: Menu = {
    name,
    items,
  };

  const menuBaseDirectory = getMenuDirectory(slug);

  await ensureDir(menuBaseDirectory);

  await writeFile(getMenuFilePath(menuBaseDirectory), JSON.stringify(data));

  revalidatePath("/" + slug);
  revalidatePath("/[...slug]");
  revalidatePath("/menus");
  redirect("/menus");
}
