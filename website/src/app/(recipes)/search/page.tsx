import getRecipes from "recipes-collection/controller/data/readIndex";
import { RECIPES_PER_SEARCH_PAGE } from "./constants";
import { SearchForm } from "./searchForm";

export default async function Search() {
  const firstPage = await getRecipes({
    limit: RECIPES_PER_SEARCH_PAGE,
  });
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose lg:max-w-4xl mx-auto grow bg-slate-950">
      <div className="m-2 text-left w-full grow">
        <SearchForm firstPage={firstPage} />
      </div>
    </main>
  );
}
