"use server";

import { auth, signIn } from "@/auth";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import parseDocsTreeFormData from "../parseFormData";
import { DocsTreeFormState } from "../formState";
import { docsTreeFilePath } from "../filesystemDirectories";
import { DocsTree } from "../types";

export default async function updateDocsTree(
  _prevState: DocsTreeFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parseDocsTreeFormData(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update DocsTree.",
    };
  }

  const { items } = validatedFields.data;

  const data: DocsTree = {
    items,
  };

  await writeFile(docsTreeFilePath, JSON.stringify(data));

  revalidatePath("/doc-tree/");
  revalidatePath("/");
}
