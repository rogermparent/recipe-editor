import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "DocPage Builder",
  description: "A docPage builder powered by LMDB and the filesystem.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <header className="w-full bg-slate-800 print:hidden">
        <Link href="/" className="block p-2">
          <h1 className="text-xl font-bold text-center">DocPage Builder</h1>
        </Link>
      </header>
      {children}
      <footer className="w-full bg-slate-800 print:hidden">
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
          <Link
            href="/new-docPage"
            className="inline-block p-2 hover:underline"
          >
            New DocPage
          </Link>
          <Link href="/settings" className="inline-block p-2 hover:underline">
            Settings
          </Link>
        </nav>
      </footer>
    </>
  );
}
