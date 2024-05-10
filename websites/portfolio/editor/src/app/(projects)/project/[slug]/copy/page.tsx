import getProjectBySlug from "projects-collection/controller/data/read";
import CopyForm from "./form";
import { notFound } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function Project({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const user = await auth();
  if (!user) {
    return signIn(undefined, {
      redirectTo: `/project/${slug}/copy`,
    });
  }
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Copying project</h1>
      <CopyForm project={project} />
    </main>
  );
}
