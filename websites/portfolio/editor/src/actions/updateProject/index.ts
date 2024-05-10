"use server";

import { auth, signIn } from "@/auth";
import updateProject from "projects-collection/controller/actions/update";
import { ProjectFormState } from "projects-collection/controller/formState";

export default async function authenticateAndUpdateProject(
  currentDate: number,
  currentSlug: string,
  _prevState: ProjectFormState,
  formData: FormData,
) {
  const user = await auth();
  if (!user) {
    return signIn();
  }
  return updateProject(currentDate, currentSlug, _prevState, formData);
}
