import { getPostBySlug } from "@/app/lib/data";
import Markdown from "react-markdown";
import styles from "@/components/Markdown/styles.module.css";
import clsx from "clsx";
import Link from "next/link";
import { deletePost } from "@/app/lib/actions";
import Image from "next/image";
import { getPlaceholder } from "@/app/lib/placeholders";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (e) {
    if ((e as { code: string }).code === "ENOENT") {
      notFound();
    }
    throw e;
  }
  const { title, body, date, image } = post;
  const placeholderURL = image && (await getPlaceholder(slug, image));

  const deletePostWithId = deletePost.bind(null, date, slug);

  const user = await auth();

  return (
    <main className="flex flex-col items-center w-full h-full max-w-prose grow py-2">
      <h1 className="text-2xl font-bold my-2">{title}</h1>
      {image && (
        <Image
          src={`/post/${slug}/uploads/${image}`}
          placeholder="blur"
          alt="Heading image"
          width={800}
          height={450}
          blurDataURL={placeholderURL}
          className="object-cover aspect-ratio-[16/10] h-96"
        />
      )}
      <hr className="w-full border-slate-700" />
      <Markdown className={clsx("w-full my-3 px-4 grow", styles.content)}>
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
