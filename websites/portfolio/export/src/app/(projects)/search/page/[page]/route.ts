import { PROJECTS_PER_SEARCH_PAGE } from "projects-collection/components/SearchForm/constants";
import getProjects from "projects-collection/controller/data/readIndex";

export async function GET(
  _request: Request,
  { params: { page } }: { params: { page: string } },
) {
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new Error("Invalid page number");
  }

  const { projects, more } = await getProjects({
    offset: (pageNumber - 1) * PROJECTS_PER_SEARCH_PAGE,
    limit: PROJECTS_PER_SEARCH_PAGE,
  });

  return Response.json({ projects, more });
}

export async function generateStaticParams() {
  const { projects } = await getProjects();
  const indexPageParams = [];
  for (let i = 0; i * PROJECTS_PER_SEARCH_PAGE <= projects.length; i++) {
    indexPageParams.push({ page: String(i + 1) });
  }
  return indexPageParams;
}
