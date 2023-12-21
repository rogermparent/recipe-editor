import getPosts from "@/app/lib/models/posts/data/readIndex";
import { PostList } from "@/components/Post/List";
import Link from "next/link";

export default async function Posts() {
  const { posts, more } = await getPosts({ limit: 5 });

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-prose mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">All Posts</h2>
        {posts && posts.length > 0 ? (
          <div>
            <PostList posts={posts} />
            <div className="flex flex-row items-center justify-center font-semibold">
              <Link
                href="/"
                className="text-center p-1 m-1 bg-slate-700 rounded-sm"
              >
                Home
              </Link>
              <span className="p-1 m-1">1</span>
              {more && (
                <Link
                  href="/posts/2"
                  className="text-center p-1 m-1 bg-slate-700 rounded-sm"
                >
                  &rarr;
                </Link>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center my-4">There are no posts yet.</p>
        )}
      </div>
    </main>
  );
}
