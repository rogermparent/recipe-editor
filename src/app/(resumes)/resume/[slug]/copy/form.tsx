"use client";

import ResumeFields from "@/components/Resume/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Resume } from "@/app/lib/models/resumes/types";
import { ResumeFormState } from "@/app/lib/models/resumes/formState";
import createResume from "@/app/lib/models/resumes/actions/create";

export default function CopyResumeForm({ resume }: { resume: Resume }) {
  const initialState = { message: "", errors: {} } as ResumeFormState;
  const [state, dispatch] = useFormState(createResume, initialState);
  const { job, company, date, ...cleanedResume } = resume;
  return (
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <ResumeFields resume={cleanedResume} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
