"use client";

import UpdateProjectFields from "projects-collection/components/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { Project } from "projects-collection/controller/types";
import { ProjectFormState } from "projects-collection/controller/formState";
import createProject from "projects-collection/controller/actions/create";

export default function CopyProjectForm({ project }: { project: Project }) {
  const initialState = { message: "", errors: {} } as ProjectFormState;
  const [state, dispatch] = useFormState(createProject, initialState);
  const { name, date, ...cleanedProject } = project;
  return (
    <form
      id="project-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <UpdateProjectFields project={cleanedProject} state={state} />
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
    </form>
  );
}
