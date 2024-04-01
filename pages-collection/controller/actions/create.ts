"use server";

import parsePageFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PageFormState } from "../formState";
import { Page } from "../types";
import { getPageDirectory, getPageFilePath } from "../filesystemDirectories";
import createDefaultSlug from "../createSlug";
import { ensureDir } from "fs-extra";

export default async function createPage(
  _prevState: PageFormState,
  formData: FormData,
) {
  const validatedFields = parsePageFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Page.",
    };
  }

  const {
    date: givenDate,
    slug: givenSlug,
    name,
    content,
  } = validatedFields.data;

  const date: number = givenDate || (Date.now() as number);
  const slug = slugify(givenSlug || createDefaultSlug(validatedFields.data));

  const data: Page = {
    name,
    date,
    content,
  };

  const pageBaseDirectory = getPageDirectory(slug);

  await ensureDir(pageBaseDirectory);

  await writeFile(getPageFilePath(pageBaseDirectory), JSON.stringify(data));

  revalidatePath("/" + slug);
  revalidatePath("/[...slug]");
  revalidatePath("/pages");
  redirect("/" + slug);
}
