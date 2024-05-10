import getProjects from "projects-collection/controller/data/readIndex";
import ProjectList from "projects-collection/components/List";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PROJECTS_PER_PAGE } from "../constants";

export default async function Projects({
  params: { page },
}: {
  params: { page: string };
}) {
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new Error("Invalid page number");
  }
  if (pageNumber === 1) {
    redirect("/projects");
  }

  const { projects, more } = await getProjects({
    offset: (pageNumber - 1) * PROJECTS_PER_PAGE,
    limit: PROJECTS_PER_PAGE,
  });

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-4xl mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">All Projects</h2>
        {projects && projects.length > 0 ? (
          <div>
            <ProjectList projects={projects} />
            <div className="flex flex-row items-center justify-center font-semibold">
              <Link
                href={`/projects/${pageNumber === 2 ? "" : pageNumber - 1}`}
                className="text-center p-1 m-1 bg-slate-700 rounded-sm"
              >
                &larr;
              </Link>
              <span className="p-1 m-1">{pageNumber}</span>
              {more && (
                <Link
                  href={`/projects/${pageNumber + 1}`}
                  className="text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  &rarr;
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center my-4">There are no projects yet.</p>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const { projects } = await getProjects();
  const indexPageParams = [];
  for (let i = 0; i * PROJECTS_PER_PAGE <= projects.length; i++) {
    indexPageParams.push({ page: String(i + 1) });
  }
  return indexPageParams;
}
