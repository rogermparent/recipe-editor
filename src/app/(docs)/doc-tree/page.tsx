import getDocPageBySlug from "@/app/lib/models/docPages/data/read";
import getDocsTree from "@/app/lib/models/docsTree/data/read";
import { DocsTreeNode } from "@/app/lib/models/docsTree/types";
import Link from "next/link";

async function DocsTreeSingleNodeItem({ node }: { node: DocsTreeNode }) {
  if ("slug" in node) {
    try {
      const { slug } = node;
      const docPage = await getDocPageBySlug(slug);
      return (
        <Link className="underline" href={`/docPage/${slug}`}>
          {docPage.name}
        </Link>
      );
    } catch (e) {
      const { slug } = node;
      return (
        <div>
          <span className="text-red-300">{slug}</span>{" "}
          <Link href={`/new-docPage/${slug}`} className="underline">
            (Create)
          </Link>
        </div>
      );
    }
  }
}

async function DocsTreeNodeItem({ node }: { node: DocsTreeNode }) {
  return (
    <div className="my-1 pl-1">
      <details className="hover:bg-slate-700 transition border pl-1">
        <summary className="block">
          <DocsTreeSingleNodeItem node={node} />
        </summary>
      </details>
      {"children" in node && (
        <ul className="border-l-2 mt-1 ml-0.5 pl-1">
          {node.children?.map((child, i) => (
            <li key={i}>
              <DocsTreeNodeItem node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function DocPages() {
  const docsTree = await getDocsTree();
  const { items } = docsTree;
  return (
    <main className="flex flex-col items-center w-full p-2 max-w-prose mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Edit Docs Tree</h2>
        <ul>
          {items.map((node, i) => {
            return (
              <li key={i}>
                <DocsTreeNodeItem node={node} />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
