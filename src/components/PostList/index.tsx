import { deletePost } from "@/app/lib/actions";
import { PostEntry } from "@/app/lib/data";
import Link from "next/link";
import { ReactNode } from "react";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";

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

export function PostListItem({
  title,
  slug,
  date,
  body,
}: {
  title: string;
  slug: string;
  date: number;
  body?: string;
}) {
  const deletePostWithId = deletePost.bind(null, date, slug);

  return (
    <div className="my-1 py-1 rounded-lg bg-slate-900">
      <Link
        href={`/post/${slug}`}
        className="underline block text-lg font-semibold px-3"
      >
        {title || String(date)}
      </Link>
      <Markdown className={clsx(styles.content, "my-2 mx-3")}>{body}</Markdown>
      <div className="text-sm italic px-2 text-gray-400">
        {new Date(date).toLocaleString()}
      </div>
      <div className="flex flex-row justify-center">
        <form action={deletePostWithId}>
          <button className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1">
            Delete
          </button>
        </form>
        <Link
          href={`/post/${slug}/edit`}
          className="underline bg-slate-700 rounded-md text-sm py-1 px-2 mx-1"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export function PostList({ posts }: { posts: PostEntry[] }) {
  return (
    <ul>
      {posts.map((entry) => {
        const {
          key: [date, slug],
          value: { title, body },
        } = entry;
        return (
          <li key={slug}>
            <PostListItem title={title} slug={slug} date={date} body={body} />
          </li>
        );
      })}
    </ul>
  );
}
