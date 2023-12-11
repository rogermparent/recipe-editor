import { getPostBySlug } from "@/app/lib/data";
import EditForm from "./form";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(slug);
  const { title } = post;
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing post: {title}</h1>
      <EditForm post={post} slug={slug} />
    </main>
  );
}
