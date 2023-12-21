"use server";

import { auth, signIn } from "@/auth";
import { rm } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import  getResumeDatabase  from "../database";
import { getResumeDirectory } from "../filesystemDirectories";

export default async function deleteResume(
  date: number,
  slug: string,
  _formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const db = getResumeDatabase();
  const resumeDirectory = getResumeDirectory(slug);
  try {
    await rm(resumeDirectory, { recursive: true });
    await db.remove([date, slug]);
    revalidatePath("/resume/" + slug);
    revalidatePath("/");
    redirect("/");
  } catch (e) {
    throw e;
  } finally {
    db.close();
  }
}
