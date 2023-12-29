"use server";

import { auth, signIn } from "@/auth";
import { rm } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getDocPageDatabase from "../database";
import { getDocPageDirectory } from "../filesystemDirectories";

export default async function deleteDocPage(
  date: number,
  slug: string,
  _formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const db = getDocPageDatabase();
  const docPageDirectory = getDocPageDirectory(slug);
  try {
    await rm(docPageDirectory, { recursive: true });
    await db.remove([date, slug]);
    revalidatePath("/docPage/" + slug);
    revalidatePath("/");
    redirect("/");
  } catch (e) {
    throw e;
  } finally {
    db.close();
  }
}
