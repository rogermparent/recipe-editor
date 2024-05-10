import Link from "next/link";
import { notFound } from "next/navigation";
import getProjectBySlug from "projects-collection/controller/data/read";
import { ProjectView } from "projects-collection/components/View";
import deleteProject from "@/actions/deleteProject";

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
  const { date } = project;

  const deleteProjectWithId = deleteProject.bind(null, date, slug);

  return (
    <main className="flex flex-col items-center w-full h-full grow">
      <div className="flex flex-row grow w-full h-full">
        <div className="grow flex flex-col flex-nowrap items-center">
          <ProjectView project={project} slug={slug} />
        </div>
      </div>
      <hr className="w-full border-slate-700 print:hidden" />
      <div className="flex flex-row justify-center m-1 print:hidden">
        <form action={deleteProjectWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/project/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
        <Link
          href={`/project/${slug}/copy`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Copy
        </Link>
      </div>
    </main>
  );
}
