import Link from "next/link";
import { ReactNode } from "react";
import {
  DocPageEntry,
  DocPageEntryValue,
} from "@/app/lib/models/docPages/types";

export function ButtonLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="">
      {children}
    </Link>
  );
}

export async function Item({
  slug,
  date,
  name,
}: DocPageEntryValue & { date: number; slug: string }) {
  return (
    <div className="my-1 rounded-lg bg-slate-900 overflow-hidden w-full h-full">
      <Link href={`/docPage/${slug}`} className="block group">
        <div className={"my-1 mx-3"}>{name}</div>
        <div className="text-sm italic px-2 text-gray-400 my-1">
          {new Date(date).toLocaleString()}
        </div>
      </Link>
    </div>
  );
}

export default function DocPageList({
  docPages,
}: {
  docPages: DocPageEntry[];
}) {
  return (
    <ul className="mx-auto flex flex-col sm:flex-row sm:flex-wrap items-center justify-center">
      {docPages.map((entry) => {
        const {
          key: [date, slug],
          value: { name },
        } = entry;
        return (
          <li key={slug} className="w-full sm:p-1">
            <Item slug={slug} date={date} name={name} />
          </li>
        );
      })}
    </ul>
  );
}
