"use client";

import CreateProjectFields from "projects-collection/components/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { ProjectFormState } from "projects-collection/controller/formState";
import createProject from "projects-collection/controller/actions/create";
import { Project } from "projects-collection/controller/types";

export default function NewProjectForm({
  slug,
  project,
}: {
  slug?: string;
  project?: Partial<Project>;
}) {
  const initialState = { message: "", errors: {} } as ProjectFormState;
  const [state, dispatch] = useFormState(createProject, initialState);
  return (
    <form id="project-form" className="m-2 w-full" action={dispatch}>
      <h2 className="font-bold text-2xl mb-2">New Project</h2>
      <div className="flex flex-col flex-nowrap">
        <CreateProjectFields state={state} slug={slug} project={project} />
        <div id="missing-fields-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
        <div className="my-1">
          <Button type="submit">
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
