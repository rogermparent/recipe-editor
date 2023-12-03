import { getPosts } from "@/app/lib/data";
import { createPost, reloadPosts } from "@/app/lib/actions";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PostList } from "@/components/PostList";
import { PostFields } from "@/components/PostForm";

export default async function Home() {
  const { posts, more } = await getPosts({ limit: 3 });

  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto">
      <form className="m-2 w-full" action={createPost}>
        <h2 className="font-bold text-2xl mb-2">New Post</h2>
        <div className="flex flex-col flex-nowrap">
          <PostFields />
          <div className="my-1">
            <Button>
              <span>Post</span>
            </Button>
          </div>
        </div>
      </form>
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Latest Posts</h2>
        {posts && posts.length > 0 ? (
          <div>
            <PostList posts={posts} />
            <div className="flex flex-row items-center justify-center">
              {more && (
                <Link
                  href="/posts"
                  className="font-semibold text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  More
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center my-4">There are no posts yet.</p>
        )}
      </div>
      <div className="p-2">
        <form action={reloadPosts}>
          <Button>Reload Database</Button>
        </form>
      </div>
    </main>
  );
}
