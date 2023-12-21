import Link from "next/link";
import { PostList } from "@/components/Post/List";
import getPosts from "../lib/models/posts/data/readIndex";

export default async function Home() {
  const { posts, more } = await getPosts({ limit: 3 });
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow bg-slate-950">
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
    </main>
  );
}
