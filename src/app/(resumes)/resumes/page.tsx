import getResumes from "@/app/lib/models/resumes/data/readIndex";
import  ResumeList  from "@/components/Resume/List";
import Link from "next/link";

export default async function Resumes() {
  const { resumes, more } = await getResumes({ limit: 5 });

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-prose mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">All Resumes</h2>
        {resumes && resumes.length > 0 ? (
          <div>
            <ResumeList resumes={resumes} />
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
                  href="/resumes/2"
                  className="text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  &rarr;
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center my-4">There are no resumes yet.</p>
        )}
      </div>
    </main>
  );
}
