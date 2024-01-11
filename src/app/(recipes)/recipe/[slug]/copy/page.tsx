import getRecipeBySlug from "@/app/lib/models/recipes/data/read";
import CopyForm from "./form";
import { notFound } from "next/navigation";

export default async function Recipe({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let recipe;
  try {
    recipe = await getRecipeBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Copying recipe</h1>
      <CopyForm recipe={recipe} />
    </main>
  );
}
