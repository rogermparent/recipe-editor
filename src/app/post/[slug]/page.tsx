import { getPostBySlug } from "@/app/lib/data";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(slug);
  const { title, body } = post;
  return (
    <main className="flex flex-col items-center p-4 w-full max-w-prose">
      <h1 className="text-2xl font-bold my-2">{title}</h1>
      <Markdown className={clsx("w-full my-4", styles.content)}>
        {body}
      </Markdown>
    </main>
  );
}
