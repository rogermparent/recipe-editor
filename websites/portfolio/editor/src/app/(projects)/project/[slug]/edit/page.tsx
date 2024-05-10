import getProjectBySlug from "projects-collection/controller/data/read";
import EditForm from "./form";
import { notFound } from "next/navigation";
import { getTransformedProjectImageProps } from "projects-collection/components/ProjectImage";
import { auth, signIn } from "@/auth";

export default async function Project({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const user = await auth();
  if (!user) {
    return signIn(undefined, {
      redirectTo: `/project/${slug}/edit`,
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
  const { name, image } = project;
  const defaultImage =
    slug && image
      ? await getTransformedProjectImageProps({
          slug,
          image,
          alt: "Heading image",
          width: 580,
          height: 450,
          className: "object-cover aspect-ratio-[16/10] h-96",
          sizes: "100vw",
        })
      : undefined;
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing Project: {name}</h1>
      <EditForm project={project} slug={slug} defaultImage={defaultImage} />
    </main>
  );
}
