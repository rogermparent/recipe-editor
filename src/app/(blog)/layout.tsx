import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "A resume builder powered by LMDB and the filesystem.",
};

export default async function Layout({
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
            Resume Builder
          </h1>
        </Link>
      </header>
      {children}
      <footer className="w-full bg-slate-800">
        <nav className="flex flex-row flex-wrap justify-center">
          {session ? (
            <>
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
          )}
          <Link href="/new-resume" className="inline-block p-2 hover:underline">
            New Resume
          </Link>
          <Link href="/settings" className="inline-block p-2 hover:underline">
            Settings
          </Link>
        </nav>
      </footer>
    </>
  );
}
