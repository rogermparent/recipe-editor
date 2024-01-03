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
): Promise<DocsTreeFormState> {
  const user = await auth();
  if (!user) {
    return signIn();
  }

  const validatedFields = parseDocsTreeFormData(formData);

  if (!validatedFields.success) {
    const issuesByPath: Record<string, string[]> = {};
    for (const issue of validatedFields.error.issues) {
      const currentPathString = issue.path.join(".");
      if (!issuesByPath[currentPathString]) {
        issuesByPath[currentPathString] = [];
      }
      issuesByPath[currentPathString].push(issue.message);
    }
    console.log(issuesByPath);
    return {
      errors: issuesByPath,
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
  return { message: "Tree update successful!" };
}
