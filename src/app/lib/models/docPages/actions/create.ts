"use server";

import { auth, signIn } from "@/auth";
import parseDocPageFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { mkdirIfNotPresent } from "@/app/lib/util";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DocPageFormState } from "../formState";
import { DocPage } from "../types";
import {
  getDocPageDirectory,
  getDocPageFilePath,
} from "../filesystemDirectories";
import getDocPageDatabase from "../database";
import buildDocPageIndexValue from "../buildIndexValue";
import createDefaultSlug from "../createSlug";

export default async function createDocPage(
  _prevState: DocPageFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parseDocPageFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create DocPage.",
    };
  }

  const {
    date: givenDate,
    slug: givenSlug,
    company,
    job,
    address,
    email,
    github,
    linkedin,
    name,
    phone,
    skills,
    website,
    education,
    experience,
    projects,
  } = validatedFields.data;

  const date: number = givenDate || (Date.now() as number);
  const slug = slugify(givenSlug || createDefaultSlug(validatedFields.data));
  const data: DocPage = {
    company,
    job,
    date,
    address,
    email,
    github,
    linkedin,
    name,
    phone,
    skills,
    website,
    education,
    experience,
    projects,
  };
  const docPageBaseDirectory = getDocPageDirectory(slug);
  await mkdirIfNotPresent(docPageBaseDirectory);
  await writeFile(
    getDocPageFilePath(docPageBaseDirectory),
    JSON.stringify(data),
  );
  const db = getDocPageDatabase();
  try {
    await db.put([date, slug], buildDocPageIndexValue(data));
  } catch (e) {
    return { message: "Failed to write docPage" };
  } finally {
    db.close();
  }
  revalidatePath("/docPage/" + slug);
  revalidatePath("/docPages");
  revalidatePath("/docPages/[page]", "page");
  revalidatePath("/");
  redirect("/docPage/" + slug);
}
