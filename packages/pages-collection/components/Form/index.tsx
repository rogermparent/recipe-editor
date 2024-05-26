import { Page } from "../../controller/types";
import { PageFormState } from "../../controller/formState";
import PageFields from "./fields";

export default function PageForm({
  page,
  slug,
  state,
}: {
  page?: Partial<Page>;
  slug?: string;
  state: PageFormState;
}) {
  return <PageFields page={page} slug={slug} state={state} />;
}
