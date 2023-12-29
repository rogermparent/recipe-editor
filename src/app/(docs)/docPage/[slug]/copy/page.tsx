import getDocPageBySlug from "@/app/lib/models/docPages/data/read";
import CopyForm from "./form";
import { notFound } from "next/navigation";

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
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Copying docPage</h1>
      <CopyForm docPage={docPage} />
    </main>
  );
}
