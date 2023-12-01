import { updatePost } from "@/app/lib/actions";
import { getPostBySlug } from "@/app/lib/data";
import { Button } from "@/components/Button";
import { PostFields } from "@/components/PostForm";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(slug);
  const { title, date } = post;
  const deleteThisPost = updatePost.bind(null, date, slug);
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">Editing post: {title}</h1>
      <form
        className="w-full h-full flex flex-col grow"
        action={deleteThisPost}
      >
        <PostFields post={post} slug={slug} />
        <div className="flex flex-row flex-nowrap my-1">
          <Button>Submit</Button>
        </div>
      </form>
    </main>
  );
}
