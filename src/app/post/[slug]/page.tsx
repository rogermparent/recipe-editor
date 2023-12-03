import { getPostBySlug } from "@/app/lib/data";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";
import Link from "next/link";
import { deletePost } from "@/app/lib/actions";
import Image from "next/image";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(slug);
  const { title, body, date, image } = post;
  const deletePostWithId = deletePost.bind(null, date, slug);
  return (
    <main className="flex flex-col items-center w-full h-full max-w-prose">
      <h1 className="text-2xl font-bold my-2 p-4">{title}</h1>
      {image && (
        <Image
          src={`/post/${slug}/uploads/${image}`}
          alt="Heading image"
          width={850}
          height={475}
        />
      )}
      <Markdown className={clsx("w-full my-4 px-4 grow", styles.content)}>
        {body}
      </Markdown>
      <div className="flex flex-row justify-center m-1">
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
    </main>
  );
}
