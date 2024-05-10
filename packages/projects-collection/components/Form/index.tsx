import { Project } from "../../controller/types";
import { ProjectFormState } from "../../controller/formState";
import ProjectFields from "./fields";

export default async function ProjectForm({
  project,
  slug,
  state,
}: {
  project?: Partial<Project>;
  slug?: string;
  state: ProjectFormState;
}) {
  return <ProjectFields project={project} slug={slug} state={state} />;
}
