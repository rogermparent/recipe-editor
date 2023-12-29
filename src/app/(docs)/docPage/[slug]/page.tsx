import Link from "next/link";
import { notFound } from "next/navigation";
import getDocPageBySlug from "@/app/lib/models/docPages/data/read";
import deleteDocPage from "@/app/lib/models/docPages/actions/delete";
import { DocPageView } from "@/components/DocPage/View";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return { title: slug };
}

export default async function DocPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let docPage;
  try {
    docPage = await getDocPageBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  const { date } = docPage;

  const deleteDocPageWithId = deleteDocPage.bind(null, date, slug);

  return (
    <main className="flex flex-col items-center w-full h-full grow">
      <DocPageView docPage={docPage} />
      <hr className="w-full border-slate-700 print:hidden" />
      <div className="flex flex-row justify-center m-1 print:hidden">
        <form action={deleteDocPageWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/docPage/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
        <Link
          href={`/docPage/${slug}/copy`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Copy
        </Link>
      </div>
    </main>
  );
}
