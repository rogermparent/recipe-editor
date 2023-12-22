import Link from "next/link";
import { notFound } from "next/navigation";
import getResumeBySlug from "@/app/lib/models/resumes/data/read";
import deleteResume from "@/app/lib/models/resumes/actions/delete";

export default async function Resume({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let resume;
  try {
    resume = await getResumeBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  const { company, job, date } = resume;

  const deleteResumeWithId = deleteResume.bind(null, date, slug);

  return (
    <main className="flex flex-col items-center w-full h-full max-w-prose grow py-2">
      <h1 className="text-2xl font-bold my-2">{job}</h1>
      <h2 className="text-2xl font-bold my-2">{company}</h2>
      <hr className="w-full border-slate-700" />
      <div className="flex flex-row justify-center m-1">
        <form action={deleteResumeWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/resume/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
      </div>
    </main>
  );
}
