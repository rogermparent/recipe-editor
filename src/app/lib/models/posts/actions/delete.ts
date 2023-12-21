"use server";

import { auth, signIn } from "@/auth";
import { rm } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import  getPostDatabase  from "../database";
import { getPostDirectory } from "../filesystemDirectories";

export default async function deletePost(
  date: number,
  slug: string,
  _formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const db = getPostDatabase();
  const postDirectory = getPostDirectory(slug);
  try {
    await rm(postDirectory, { recursive: true });
    await db.remove([date, slug]);
    revalidatePath("/post/" + slug);
    revalidatePath("/");
    redirect("/");
  } catch (e) {
    throw e;
  } finally {
    db.close();
  }
}
