import getProjects from "projects-collection/controller/data/readIndex";
import ProjectList from "projects-collection/components/List";
import Link from "next/link";
import { PROJECTS_PER_PAGE } from "./constants";

export default async function Projects() {
  const { projects, more } = await getProjects({ limit: PROJECTS_PER_PAGE });

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-4xl mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">All Projects</h2>
        {projects && projects.length > 0 ? (
          <div>
            <ProjectList projects={projects} />
            <div className="flex flex-row items-center justify-center font-semibold">
              <Link
                href="/"
                className="text-center p-1 m-1 bg-slate-700 rounded-sm"
              >
                Home
              </Link>
              <span className="p-1 m-1">1</span>
              {more && (
                <Link
                  href="/projects/2"
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
