import Link from "next/link";
import ProjectList from "projects-collection/components/List";
import getProjects from "projects-collection/controller/data/readIndex";

export default async function Home() {
  const { projects, more } = await getProjects({ limit: 6 });
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose lg:max-w-4xl mx-auto grow bg-slate-950">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Latest Projects</h2>
        {projects && projects.length > 0 ? (
          <div>
            <ProjectList projects={projects} />
            <div className="flex flex-row items-center justify-center">
              {more && (
                <Link
                  href="/projects"
                  className="font-semibold text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  More
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
