import { getPostBySlug } from "@/app/lib/data";
import EditForm from "./form";
import { notFound } from "next/navigation";

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
  const { title } = post;
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing post: {title}</h1>
      <EditForm post={post} slug={slug} />
    </main>
  );
}
