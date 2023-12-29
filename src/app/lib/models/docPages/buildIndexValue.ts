import { DocPage, DocPageEntryValue } from "./types";

export default function buildDocPageIndexValue(
  docPage: DocPage,
): DocPageEntryValue {
  const { job, company } = docPage;
  return { job, company };
}
