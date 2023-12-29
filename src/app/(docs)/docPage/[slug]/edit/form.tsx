"use client";

import UpdateDocPageFields from "@/components/DocPage/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { DocPage } from "@/app/lib/models/docPages/types";
import { DocPageFormState } from "@/app/lib/models/docPages/formState";
import updateDocPage from "@/app/lib/models/docPages/actions/update";

export default function EditDocPageForm({
  docPage,
  slug,
}: {
  slug: string;
  docPage: DocPage;
}) {
  const { date } = docPage;
  const initialState = { message: "", errors: {} } as DocPageFormState;
  const updateThisDocPage = updateDocPage.bind(null, date, slug);
  const [state, dispatch] = useFormState(updateThisDocPage, initialState);
  return (
    <form className="w-full h-full flex flex-col grow" action={dispatch}>
      <UpdateDocPageFields docPage={docPage} slug={slug} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
