import getPageBySlug from "pages-collection/controller/data/read";
import EditForm from "./form";
import { notFound } from "next/navigation";

export default async function Page({
  params: { slug: slugSegments },
}: {
  params: { slug: string[] };
}) {
  const slug = slugSegments.join("/");
  let page;
  console.log({ slug });
  try {
    page = await getPageBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  const { name } = page;
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing Page: {name}</h1>
      <EditForm page={page} slug={slug} />
    </main>
  );
}
