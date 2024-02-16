import getRecipes from "recipes-collection/controller/data/readIndex";
import { RECIPES_PER_SEARCH_PAGE } from "../../constants";

export async function GET(
  _request: Request,
  { params: { page } }: { params: { page: string } },
) {
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new Error("Invalid page number");
  }

  const { recipes, more } = await getRecipes({
    offset: (pageNumber - 1) * RECIPES_PER_SEARCH_PAGE,
    limit: RECIPES_PER_SEARCH_PAGE,
  });

  return Response.json({ recipes, more });
}

export async function generateStaticParams() {
  const { recipes } = await getRecipes();
  const indexPageParams = [];
  for (let i = 0; i * RECIPES_PER_SEARCH_PAGE <= recipes.length; i++) {
    indexPageParams.push({ page: String(i + 1) });
  }
  return indexPageParams;
}
