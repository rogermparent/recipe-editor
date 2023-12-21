"use server";

import { auth, signIn } from "@/auth";
import parsePostFormData from "../parseFormData";
import slugify from "@sindresorhus/slugify";
import { mkdirIfNotPresent } from "@/app/lib/util";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostFormState } from "../formState";
import { Post } from "../types";
import { getPostDirectory, getPostFilePath } from "../filesystemDirectories";
import writePostUpload from "../writeUpload";
import getPostDatabase from "../database";
import buildPostIndexValue from "../buildIndexValue";

export default async function createPost(
  _prevState: PostFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parsePostFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Post.",
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
  const data: Post = {
    image: hasImage ? image.name : undefined,
    summary,
    title,
    body,
    date,
  };
  const postBaseDirectory = getPostDirectory(slug);
  await mkdirIfNotPresent(postBaseDirectory);
  await writeFile(getPostFilePath(postBaseDirectory), JSON.stringify(data));
  if (hasImage) {
    await writePostUpload(postBaseDirectory, image);
  }
  const db = getPostDatabase();
  try {
    await db.put([date, slug], buildPostIndexValue(data));
  } catch (e) {
    return { message: "Failed to write post" };
  } finally {
    db.close();
  }
  revalidatePath("/post/" + slug);
  revalidatePath("/posts");
  revalidatePath("/posts/[page]", "page");
  revalidatePath("/");
  redirect("/post/" + slug);
}
