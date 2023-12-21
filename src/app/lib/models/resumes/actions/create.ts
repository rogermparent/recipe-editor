"use server";

import { auth, signIn } from "@/auth";
import parseResumeFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { mkdirIfNotPresent } from "@/app/lib/util";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ResumeFormState } from "../formState";
import { Resume } from "../types";
import { getResumeDirectory, getResumeFilePath } from "../filesystemDirectories";
import writeResumeUpload from "../writeUpload";
import getResumeDatabase from "../database";
import buildResumeIndexValue from "../buildIndexValue";

export default async function createResume(
  _prevState: ResumeFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parseResumeFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Resume.",
    };
  }

  const {
    date: givenDate,
    slug: givenSlug,
    title,
    body,
    summary,
    image,
  } = validatedFields.data;

  const date: number = givenDate || (Date.now() as number);
  const slug = slugify(givenSlug || title);
  const hasImage = image && image.size > 0;
  const data: Resume = {
    image: hasImage ? image.name : undefined,
    summary,
    title,
    body,
    date,
  };
  const resumeBaseDirectory = getResumeDirectory(slug);
  await mkdirIfNotPresent(resumeBaseDirectory);
  await writeFile(getResumeFilePath(resumeBaseDirectory), JSON.stringify(data));
  if (hasImage) {
    await writeResumeUpload(resumeBaseDirectory, image);
  }
  const db = getResumeDatabase();
  try {
    await db.put([date, slug], buildResumeIndexValue(data));
  } catch (e) {
    return { message: "Failed to write resume" };
  } finally {
    db.close();
  }
  revalidatePath("/resume/" + slug);
  revalidatePath("/resumes");
  revalidatePath("/resumes/[page]", "page");
  revalidatePath("/");
  redirect("/resume/" + slug);
}
