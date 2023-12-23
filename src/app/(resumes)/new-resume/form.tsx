"use client";

import ResumeFields from "@/components/Resume/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { ResumeFormState } from "@/app/lib/models/resumes/formState";
import createResume from "@/app/lib/models/resumes/actions/create";

export default function NewResumeForm() {
  const initialState = { message: "", errors: {} } as ResumeFormState;
  const [state, dispatch] = useFormState(createResume, initialState);
  return (
    <form className="m-2 w-full" action={dispatch}>
      <h2 className="font-bold text-2xl mb-2">New Resume</h2>
      <div className="flex flex-col flex-nowrap">
        <ResumeFields state={state} />
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
