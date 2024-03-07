import { notFound } from "next/navigation";
import getRecipeBySlug from "recipes-collection/controller/data/read";
import { RecipeView } from "recipes-collection/components/View";
import getRecipes from "recipes-collection/controller/data/readIndex";

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

  return (
    <main className="flex flex-col items-center w-full h-full grow">
      <div className="flex flex-row grow w-full h-full">
        <div className="grow flex flex-col flex-nowrap items-center">
          <RecipeView recipe={recipe} slug={slug} />
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const { recipes } = await getRecipes();
  return recipes.map(({ slug }) => ({ slug }));
}
