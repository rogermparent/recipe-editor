import getDocsTree from "@/app/lib/models/docsTree/data/read";
import TreeForm from "./form";
import getDocPages from "@/app/lib/models/docPages/data/readIndex";
import { DocPageEntryValue } from "@/app/lib/models/docPages/types";
import { DocsTreeNode } from "@/app/lib/models/docsTree/types";

export type DocsTreeNodeWithKey = DocsTreeNode & {
  key: string | number;
  children?: DocsTreeNodeWithKey[];
};

function addKeysToItems(
  items: DocsTreeNode[],
  keyPrefix: string = "existing-",
): DocsTreeNodeWithKey[] {
  return items.map((item, i) => {
    const key = keyPrefix + i;
    const itemWithKey = {
      ...item,
      key,
      children:
        "children" in item && item?.children
          ? addKeysToItems(item.children, key + ".")
          : undefined,
    } as DocsTreeNodeWithKey;
    return itemWithKey;
  });
}

export default async function DocPages() {
  const docsTreePromise = getDocsTree();
  const docPagesPromise = getDocPages();
  const docsTree = await docsTreePromise;
  const docPages = await docPagesPromise;
  const docPagesBySlug: Record<string, DocPageEntryValue> = {};
  for (const docPageEntry of docPages.docPages) {
    docPagesBySlug[docPageEntry.key[1]] = docPageEntry.value;
  }
  const { items } = docsTree;
  const itemsWithKeys = addKeysToItems(items);
  return (
    <main className="flex flex-col items-center w-full p-2 max-w-prose mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Edit Docs Tree</h2>
        <TreeForm items={itemsWithKeys} dataBySlug={docPagesBySlug} />
      </div>
    </main>
  );
}
