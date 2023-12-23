import Link from "next/link";
import { ReactNode } from "react";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";
import { ResumeEntry, ResumeEntryValue } from "@/app/lib/models/resumes/types";

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
  company,
  slug,
  date,
  job,
}: ResumeEntryValue & { date: number; slug: string }) {
  return (
    <div className="my-1 rounded-lg bg-slate-900 overflow-hidden w-full h-full">
      <Link href={`/resume/${slug}`} className="block group">
        <div className="underline text-lg font-semibold px-3">
          {company || String(date)}
        </div>
      </Link>
      <div className={"my-1 mx-3"}>{job}</div>
      <div className="text-sm italic px-2 text-gray-400 my-1">
        {new Date(date).toLocaleString()}
      </div>
    </div>
  );
}

export default function ResumeList({ resumes }: { resumes: ResumeEntry[] }) {
  return (
    <ul className="mx-auto flex flex-col sm:flex-row sm:flex-wrap items-center justify-center">
      {resumes.map((entry) => {
        const {
          key: [date, slug],
          value: { company, job },
        } = entry;
        return (
          <li key={slug} className="max-w-full w-96 sm:p-1 sm:w-1/2 lg:w-1/3">
            <Item company={company} slug={slug} date={date} job={job} />
          </li>
        );
      })}
    </ul>
  );
}
