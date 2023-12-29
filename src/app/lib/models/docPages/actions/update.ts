"use server";

import { auth, signIn } from "@/auth";
import { rename, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parseDocPageFormData from "../parseFormData";
import { DocPageFormState } from "../formState";
import {
  getDocPageDirectory,
  getDocPageFilePath,
} from "../filesystemDirectories";
import { DocPage } from "../types";
import getDocPageDatabase from "../database";
import buildDocPageIndexValue from "../buildIndexValue";
import createDefaultSlug from "../createSlug";

export default async function updateDocPage(
  currentDate: number,
  currentSlug: string,
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
      message: "Failed to update DocPage.",
    };
  }

  const {
    date,
    slug,
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

  const currentDocPageDirectory = getDocPageDirectory(currentSlug);
  const currentDocPagePath = getDocPageFilePath(currentDocPageDirectory);

  const finalSlug = slug || createDefaultSlug(validatedFields.data);
  const finalDate = date || currentDate;
  const finalDocPageDirectory = getDocPageDirectory(finalSlug);

  const willRename = currentDocPageDirectory !== finalDocPageDirectory;
  const willChangeDate = date && currentDate !== date;

  const data: DocPage = {
    company,
    job,
    date: finalDate,
    address,
    email,
    github,
    linkedin,
    education,
    experience,
    name,
    phone,
    projects,
    skills,
    website,
  };

  if (willRename) {
    await rename(currentDocPageDirectory, finalDocPageDirectory);
    await writeFile(
      `${finalDocPageDirectory}/docPage.json`,
      JSON.stringify(data),
    );
  } else {
    await writeFile(currentDocPagePath, JSON.stringify(data));
  }

  const db = getDocPageDatabase();

  try {
    if (willRename || willChangeDate) {
      db.remove([currentDate, currentSlug]);
    }
    db.put([finalDate, finalSlug], buildDocPageIndexValue(data));
  } catch (e) {
    return { message: "Failed to write docPage to index" };
  } finally {
    db.close();
  }
  if (willRename) {
    revalidatePath("/docPage/" + currentSlug);
  }
  revalidatePath("/docPage/" + finalSlug);
  revalidatePath("/");
  redirect("/docPage/" + finalSlug);
}
