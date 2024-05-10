import getProjects from "projects-collection/controller/data/readIndex";
import { PROJECTS_PER_SEARCH_PAGE } from "projects-collection/components/SearchForm/constants";
import { SearchForm } from "projects-collection/components/SearchForm";

export default async function Search() {
  const firstPage = await getProjects({
    limit: PROJECTS_PER_SEARCH_PAGE,
  });
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose lg:max-w-4xl mx-auto grow bg-slate-950">
      <div className="m-2 text-left w-full grow">
        <SearchForm firstPage={firstPage} />
      </div>
    </main>
  );
}
