import { deletePost } from "@/app/lib/actions";
import { PostEntry } from "@/app/lib/data";
import Link from "next/link";
import { ReactNode } from "react";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";
import Image from "next/image";

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
  image,
}: {
  title: string;
  slug: string;
  date: number;
  image?: string;
  body?: string;
}) {
  const deletePostWithId = deletePost.bind(null, date, slug);

  return (
    <div className="my-1 rounded-lg bg-slate-900 overflow-hidden w-full h-full">
      <Link href={`/post/${slug}`} className="block group">
        <div className="w-full h-36 overflow-hidden bg-gray-800">
          {image && (
            <Image
              src={`/post/${slug}/uploads/${image}`}
              alt="Recipe thumbnail"
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          )}
        </div>
        <div className="underline text-lg font-semibold px-3">
          {title || String(date)}
        </div>
      </Link>
      <Markdown className={clsx(styles.content, "my-1 mx-3")}>{body}</Markdown>
      <div className="text-sm italic px-2 text-gray-400 my-1">
        {new Date(date).toLocaleString()}
      </div>
      <div className="flex flex-row justify-center m-2">
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
    <ul className="mx-auto flex flex-col sm:flex-row sm:flex-wrap items-center justify-center">
      {posts.map((entry) => {
        const {
          key: [date, slug],
          value: { title, body, image },
        } = entry;
        return (
          <li key={slug} className="max-w-full w-96 sm:p-1 sm:w-1/2 lg:w-1/3">
            <PostListItem
              title={title}
              slug={slug}
              date={date}
              body={body}
              image={image}
            />
          </li>
        );
      })}
    </ul>
  );
}
