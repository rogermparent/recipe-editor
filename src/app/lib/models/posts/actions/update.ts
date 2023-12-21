"use server";

import { auth, signIn } from "@/auth";
import { readFile, rename, rm, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parsePostFormData from "../parseFormData";
import { PostFormState } from "../formState";
import {
  getPostDirectory,
  getPostFilePath,
  getPostUploadsDirectory,
} from "../filesystemDirectories";
import { Post } from "../types";
import getPostDatabase from "../database";
import buildPostIndexValue from "../buildIndexValue";
import  writePostUpload  from "../writeUpload";

export default async function updatePost(
  currentDate: number,
  currentSlug: string,
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
      message: "Failed to update Post.",
    };
  }

  const { date, slug, title, body, summary, image } = validatedFields.data;

  const currentPostDirectory = getPostDirectory(currentSlug);
  const currentPostPath = getPostFilePath(currentPostDirectory);

  const finalSlug = slug || currentSlug;
  const finalDate = date || currentDate;
  const finalPostDirectory = getPostDirectory(finalSlug);

  const willRename = currentPostDirectory !== finalPostDirectory;
  const willChangeDate = date && currentDate !== date;

  const currentData = JSON.parse(String(await readFile(currentPostPath)));
  const hasNewImage = image && image.size > 0;

  const data: Post = {
    title,
    summary,
    body,
    date: finalDate,
    image: hasNewImage ? image.name : currentData.image,
  };

  if (willRename) {
    await rename(currentPostDirectory, finalPostDirectory);
    await writeFile(`${finalPostDirectory}/post.json`, JSON.stringify(data));
  } else {
    await writeFile(currentPostPath, JSON.stringify(data));
  }

  const db = getPostDatabase();

  try {
    if (willRename || willChangeDate) {
      db.remove([currentDate, currentSlug]);
    }
    db.put([finalDate, finalSlug], buildPostIndexValue(data));
  } catch (e) {
    return { message: "Failed to write post to index" };
  } finally {
    db.close();
  }
  if (hasNewImage) {
    const rmPromise =
      currentData.image &&
      rm(
        path.join(
          getPostUploadsDirectory(finalPostDirectory),
          currentData.image,
        ),
      );
    await rmPromise;
    await writePostUpload(finalPostDirectory, image);
  }
  if (willRename) {
    revalidatePath("/post/" + currentSlug);
  }
  revalidatePath("/post/" + finalSlug);
  revalidatePath("/");
  redirect("/post/" + finalSlug);
}
