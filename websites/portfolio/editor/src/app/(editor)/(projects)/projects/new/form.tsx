"use client";

import CreateProjectFields from "projects-collection/components/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { ProjectFormState } from "projects-collection/controller/formState";
import createProject from "projects-collection/controller/actions/create";
import Link from "next/link";

export default function NewProjectForm() {
  const initialState = { message: "", errors: {} } as ProjectFormState;
  const [state, dispatch] = useFormState(createProject, initialState);
  return (
    <form
      id="project-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <CreateProjectFields state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
      <div>
        <Link href="/projects">Back to Projects</Link>
      </div>
    </form>
  );
}
