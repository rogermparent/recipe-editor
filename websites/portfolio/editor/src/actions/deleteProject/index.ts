"use server";

import { auth, signIn } from "@/auth";
import deleteProject from "projects-collection/controller/actions/delete";

export default async function authenticateAndDeleteProject(
  currentDate: number,
  currentSlug: string,
  _formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }
  return deleteProject(currentDate, currentSlug);
}
