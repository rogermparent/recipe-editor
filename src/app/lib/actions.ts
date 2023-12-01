"use server";

import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getPostDatabase,
  getPostDirectory,
  getPostPath,
  resetPostsDatabase,
} from "./data";
import slugify from "@sindresorhus/slugify";

export async function createPost(formData: FormData) {
  const givenDate = formData.get("date") as string;
  const date = givenDate ? Number(new Date(givenDate)) : Date.now();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  if (!title) {
    return { message: "Post needs title" };
  }
  const providedSlug = formData.get("slug");
  const slug = slugify(String(providedSlug || title));
  const data = {
    title,
    body,
    date,
  };
  const destinationDir = getPostDirectory(slug);
  try {
    await mkdir(destinationDir);
    await writeFile(`${destinationDir}/post.json`, JSON.stringify(data));
  } catch (e) {
    return null;
  }
  const db = getPostDatabase();
  try {
    await db.put([date, slug], { title, body });
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

export async function updatePost(
  date: number,
  slug: string,
  formData: FormData,
) {
  const title = formData.get("title") as string;
  const newSlug = (formData.get("slug") as string) || slugify(title);
  const givenDate = formData.get("date") as string;
  const body = formData.get("body") as string;
  const willRename = newSlug !== slug;
  const finalDate = givenDate ? Number(new Date(givenDate + "Z")) : date;
  const currentData = JSON.parse(String(await readFile(getPostPath(slug))));
  const data = {
    ...currentData,
    date: finalDate,
    title,
    body,
  };
  if (willRename) {
    const destinationDir = getPostDirectory(newSlug);
    try {
      await mkdir(destinationDir);
      await writeFile(`${destinationDir}/post.json`, JSON.stringify(data));
      await rm(getPostDirectory(slug), { recursive: true });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to rename post file");
    }
  } else {
    try {
      await writeFile(getPostPath(slug), JSON.stringify(data));
    } catch (e) {
      throw new Error("Failed to write post file");
    }
  }
  const finalSlug = (newSlug as string) || slug;
  const db = getPostDatabase();
  try {
    if (willRename || finalDate !== currentData.date) {
      db.remove([date, slug]);
    }
    db.put([finalDate, finalSlug], { title, body });
  } catch (e) {
    throw new Error("Failed to write post to index");
  } finally {
    db.close();
  }
  if (willRename) {
    revalidatePath("/post/" + slug);
  }
  revalidatePath("/post/" + finalSlug);
  revalidatePath("/");
  redirect("/post/" + finalSlug);
}

export async function deletePost(
  date: number,
  slug: string,
  _formData: FormData,
) {
  const db = getPostDatabase();
  const postDirectory = getPostDirectory(slug);
  try {
    await rm(postDirectory, { recursive: true });
    await db.remove([date, slug]);
    revalidatePath("/post/" + slug);
    revalidatePath("/");
    return { message: "Post removed" };
  } catch (e) {
    return { message: "Failed to remove post" };
  } finally {
    db.close();
  }
}

export async function reloadPosts() {
  try {
    await resetPostsDatabase();
    revalidatePath("/");
  } catch (e) {
    return { message: "Could not reset posts database" };
  }
}
