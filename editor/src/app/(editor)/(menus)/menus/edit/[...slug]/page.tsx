import getMenuBySlug from "menus-collection/controller/data/read";
import EditForm from "./form";
import { notFound } from "next/navigation";
import deleteMenu from "menus-collection/controller/actions/delete";
import { Button } from "component-library/components/Button";

async function maybeGetMenu(slug: string) {
  try {
    const menu = await getMenuBySlug(slug);
    return menu;
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      return undefined;
    }
    throw e;
  }
}

export default async function Menu({
  params: { slug: slugSegments },
}: {
  params: { slug: string[] };
}) {
  const slug = slugSegments.join("/");
  const deleteThisMenu = deleteMenu.bind(null, slug);
  const menu = await maybeGetMenu(slug);

  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing Menu: {slug}</h1>
      <EditForm menu={menu} slug={slug} />
      <form action={deleteThisMenu}>
        <Button type="submit">Delete</Button>
      </form>
    </main>
  );
}
