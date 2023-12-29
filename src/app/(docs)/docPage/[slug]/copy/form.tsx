"use client";

import UpdateDocPageFields from "@/components/DocPage/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { DocPage } from "@/app/lib/models/docPages/types";
import { DocPageFormState } from "@/app/lib/models/docPages/formState";
import createDocPage from "@/app/lib/models/docPages/actions/create";

export default function CopyDocPageForm({ docPage }: { docPage: DocPage }) {
  const initialState = { message: "", errors: {} } as DocPageFormState;
  const [state, dispatch] = useFormState(createDocPage, initialState);
  const { job, company, date, ...cleanedDocPage } = docPage;
  return (
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <UpdateDocPageFields docPage={cleanedDocPage} state={state} />
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
