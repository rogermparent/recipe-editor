"use client";

import CreateDocPageFields from "@/components/DocPage/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { DocPageFormState } from "@/app/lib/models/docPages/formState";
import createDocPage from "@/app/lib/models/docPages/actions/create";

export default function NewDocPageForm() {
  const initialState = { message: "", errors: {} } as DocPageFormState;
  const [state, dispatch] = useFormState(createDocPage, initialState);
  return (
    <form className="m-2 w-full" action={dispatch}>
      <h2 className="font-bold text-2xl mb-2">New DocPage</h2>
      <div className="flex flex-col flex-nowrap">
        <CreateDocPageFields state={state} />
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
