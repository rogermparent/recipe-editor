import Link from "next/link";
import { notFound } from "next/navigation";
import getDocPageBySlug from "@/app/lib/models/docPages/data/read";
import deleteDocPage from "@/app/lib/models/docPages/actions/delete";
import { DocPageView } from "@/components/DocPage/View";
import getDocsTree from "@/app/lib/models/docsTree/data/read";
import clsx from "clsx";
import { DocsTreeNode } from "@/app/lib/models/docsTree/types";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return { title: slug };
}

async function SidebarNodeSingleItem({
  node,
  currentSlug,
}: {
  node: DocsTreeNode;
  currentSlug: string;
}) {
  if ("slug" in node) {
    try {
      const { slug } = node;
      const active = slug === currentSlug;
      const docPage = await getDocPageBySlug(slug);
      return (
        <Link
          className={clsx(
            "block underline whitespace-nowrap px-2 py-0.5",
            active && "font-bold",
          )}
          href={`/docPage/${slug}`}
        >
          {docPage.name}
        </Link>
      );
    } catch (e) {
      const { slug } = node;
      return <div className="whitespace-nowrap px-2 py-0.5">{slug}</div>;
    }
  }
  return <div>Invalid node?</div>;
}

async function SidebarNodeItem({
  node,
  currentSlug,
}: {
  node: DocsTreeNode;
  currentSlug: string;
}) {
  return (
    <div>
      <SidebarNodeSingleItem node={node} currentSlug={currentSlug} />
      {"children" in node && (
        <ul className="pl-2">
          {node.children?.map((child, i) => (
            <li key={i}>
              <SidebarNodeItem node={child} currentSlug={currentSlug} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function Sidebar({ currentSlug }: { currentSlug: string }) {
  const docsTree = await getDocsTree();
  const { items } = docsTree;
  return (
    <div>
      <ul>
        {items.map((item, i) => (
          <SidebarNodeItem node={item} currentSlug={currentSlug} key={i} />
        ))}
      </ul>
    </div>
  );
}

export default async function DocPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let docPage;
  try {
    docPage = await getDocPageBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  const { date } = docPage;

  const deleteDocPageWithId = deleteDocPage.bind(null, date, slug);

  return (
    <main className="flex flex-col items-center w-full h-full grow">
      <div className="flex flex-row grow w-full h-full">
        <Sidebar currentSlug={slug} />
        <div className="grow flex flex-col flex-nowrap items-center">
          <DocPageView docPage={docPage} />
        </div>
      </div>
      <hr className="w-full border-slate-700 print:hidden" />
      <div className="flex flex-row justify-center m-1 print:hidden">
        <form action={deleteDocPageWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/docPage/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
        <Link
          href={`/docPage/${slug}/copy`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Copy
        </Link>
      </div>
    </main>
  );
}
