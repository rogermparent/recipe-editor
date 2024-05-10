"use client";

import UpdateProjectFields from "projects-collection/components/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { Project } from "projects-collection/controller/types";
import { ProjectFormState } from "projects-collection/controller/formState";
import { StaticImageProps } from "next-static-image/src";
import updateProject from "@/actions/updateProject";

export default function EditProjectForm({
  project,
  slug,
  defaultImage,
}: {
  slug: string;
  project: Project;
  defaultImage?: StaticImageProps | undefined;
}) {
  const { date } = project;
  const initialState = { message: "", errors: {} } as ProjectFormState;
  const updateThisProject = updateProject.bind(null, date, slug);
  const [state, dispatch] = useFormState(updateThisProject, initialState);
  return (
    <form
      id="project-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <UpdateProjectFields
        project={project}
        slug={slug}
        state={state}
        defaultImage={defaultImage}
      />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
