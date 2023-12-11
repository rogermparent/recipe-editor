import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "My LMDB-powered Blog",
  description: "A minimal blog powered by LMDB and the filesystem.",
};

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <header className="w-full bg-slate-800">
        <Link href="/" className="block p-2">
          <h1 className="text-xl font-bold text-center">
            My LMDB-powered Blog
          </h1>
        </Link>
      </header>
      {children}
      <footer className="w-full bg-slate-800">
        <nav className="flex flex-row flex-wrap justify-center">
          {session ? (
            <>
              <Link
                href="/settings"
                className="inline-block p-2 hover:underline"
              >
                Settings
              </Link>
              <Link
                href="/new-post"
                className="inline-block p-2 hover:underline"
              >
                New Post
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button className="w-full h-full block p-2 hover:underline">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  await signIn();
                }}
              >
                <button className="w-full h-full block p-2 hover:underline">
                  Sign In
                </button>
              </form>
            </>
          )}
        </nav>
      </footer>
    </>
  );
}
