import Link from "next/link";
import DocPageList from "@/components/DocPage/List";
import getDocPages from "../lib/models/docPages/data/readIndex";

export default async function Home() {
  const { docPages, more } = await getDocPages({ limit: 3 });
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow bg-slate-950">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Latest DocPages</h2>
        {docPages && docPages.length > 0 ? (
          <div>
            <DocPageList docPages={docPages} />
            <div className="flex flex-row items-center justify-center">
              {more && (
                <Link
                  href="/docPages"
                  className="font-semibold text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  More
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center my-4">There are no docs yet.</p>
        )}
      </div>
    </main>
  );
}
