import { notFound } from "next/navigation";
import getProjectBySlug from "projects-collection/controller/data/read";
import { ProjectView } from "projects-collection/components/View";
import getProjects from "projects-collection/controller/data/readIndex";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return { title: slug };
}

export default async function Project({
  params: { slug },
}: {
  params: { slug: string };
}) {
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
    <main className="flex flex-col items-center w-full h-full grow">
      <div className="flex flex-row grow w-full h-full">
        <div className="grow flex flex-col flex-nowrap items-center">
          <ProjectView project={project} />
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const { projects } = await getProjects();
  return projects.map(({ slug }) => ({ slug }));
}
