"use server";

import { auth, signIn } from "@/auth";
import { readFile, rename, rm, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parseResumeFormData from "../parseFormData";
import { ResumeFormState } from "../formState";
import {
  getResumeDirectory,
  getResumeFilePath,
  getResumeUploadsDirectory,
} from "../filesystemDirectories";
import { Resume } from "../types";
import getResumeDatabase from "../database";
import buildResumeIndexValue from "../buildIndexValue";
import  writeResumeUpload  from "../writeUpload";

export default async function updateResume(
  currentDate: number,
  currentSlug: string,
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
      message: "Failed to update Resume.",
    };
  }

  const { date, slug, title, body, summary, image } = validatedFields.data;

  const currentResumeDirectory = getResumeDirectory(currentSlug);
  const currentResumePath = getResumeFilePath(currentResumeDirectory);

  const finalSlug = slug || currentSlug;
  const finalDate = date || currentDate;
  const finalResumeDirectory = getResumeDirectory(finalSlug);

  const willRename = currentResumeDirectory !== finalResumeDirectory;
  const willChangeDate = date && currentDate !== date;

  const currentData = JSON.parse(String(await readFile(currentResumePath)));
  const hasNewImage = image && image.size > 0;

  const data: Resume = {
    title,
    summary,
    body,
    date: finalDate,
    image: hasNewImage ? image.name : currentData.image,
  };

  if (willRename) {
    await rename(currentResumeDirectory, finalResumeDirectory);
    await writeFile(`${finalResumeDirectory}/resume.json`, JSON.stringify(data));
  } else {
    await writeFile(currentResumePath, JSON.stringify(data));
  }

  const db = getResumeDatabase();

  try {
    if (willRename || willChangeDate) {
      db.remove([currentDate, currentSlug]);
    }
    db.put([finalDate, finalSlug], buildResumeIndexValue(data));
  } catch (e) {
    return { message: "Failed to write resume to index" };
  } finally {
    db.close();
  }
  if (hasNewImage) {
    const rmPromise =
      currentData.image &&
      rm(
        path.join(
          getResumeUploadsDirectory(finalResumeDirectory),
          currentData.image,
        ),
      );
    await rmPromise;
    await writeResumeUpload(finalResumeDirectory, image);
  }
  if (willRename) {
    revalidatePath("/resume/" + currentSlug);
  }
  revalidatePath("/resume/" + finalSlug);
  revalidatePath("/");
  redirect("/resume/" + finalSlug);
}
