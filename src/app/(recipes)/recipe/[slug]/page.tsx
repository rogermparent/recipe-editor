import Link from "next/link";
import { notFound } from "next/navigation";
import getRecipeBySlug from "@/app/lib/models/recipes/data/read";
import deleteRecipe from "@/app/lib/models/recipes/actions/delete";
import { RecipeView } from "@/components/Recipe/View";
import { getPlaceholder } from "@/app/lib/placeholders";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return { title: slug };
}

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
  const { date, image } = recipe;

  const deleteRecipeWithId = deleteRecipe.bind(null, date, slug);

  const placeholderURL = image && (await getPlaceholder(slug, image));

  return (
    <main className="flex flex-col items-center w-full h-full grow">
      <div className="flex flex-row grow w-full h-full">
        <div className="grow flex flex-col flex-nowrap items-center">
          <RecipeView
            recipe={recipe}
            slug={slug}
            placeholderURL={placeholderURL}
          />
        </div>
      </div>
      <hr className="w-full border-slate-700 print:hidden" />
      <div className="flex flex-row justify-center m-1 print:hidden">
        <form action={deleteRecipeWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/recipe/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
        <Link
          href={`/recipe/${slug}/copy`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Copy
        </Link>
      </div>
    </main>
  );
}