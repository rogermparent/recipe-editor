import getMenuBySlug from "menus-collection/controller/data/read";
import EditForm from "./form";
import { notFound } from "next/navigation";

export default async function Menu({
  params: { slug: slugSegments },
}: {
  params: { slug: string[] };
}) {
  const slug = slugSegments.join("/");
  let menu;
  try {
    menu = await getMenuBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  if (!menu) {
    notFound();
  }
  const { name } = menu;
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing Menu: {name}</h1>
      <EditForm menu={menu} slug={slug} />
    </main>
  );
}
