import getDocPages from "@/app/lib/models/docPages/data/readIndex";
import DocPageList from "@/components/DocPage/List";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DocPages({
  params: { page },
}: {
  params: { page: string };
}) {
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new Error("Invalid page number");
  }
  if (pageNumber === 1) {
    redirect("/docPages");
  }

  const { docPages, more } = await getDocPages({
    offset: (pageNumber - 1) * 5,
    limit: 5,
  });

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-prose mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">All Doc Pages</h2>
        {docPages && docPages.length > 0 ? (
          <div>
            <DocPageList docPages={docPages} />
            <div className="flex flex-row items-center justify-center font-semibold">
              <Link
                href={`/docPages/${pageNumber === 2 ? "" : pageNumber - 1}`}
                className="text-center p-1 m-1 bg-slate-700 rounded-sm"
              >
                &larr;
              </Link>
              <span className="p-1 m-1">{pageNumber}</span>
              {more && (
                <Link
                  href={`/docPages/${pageNumber + 1}`}
                  className="text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  &rarr;
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
