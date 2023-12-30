import { DocPage, DocPageEntryValue } from "./types";

export default function buildDocPageIndexValue(
  docPage: DocPage,
): DocPageEntryValue {
  const { name } = docPage;
  return { name };
}
