import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { SiteHeader } from "component-library/components/SiteHeader";

export const metadata: Metadata = {
  title: "Recipe Editor",
  description: "A recipe book app powered by LMDB and the filesystem.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <SiteHeader />
      {children}
      <footer className="w-full bg-slate-800 print:hidden">
        <nav className="flex flex-row flex-wrap justify-center">
          <Link href="/pages" className="inline-block p-2 hover:underline">
            Pages
          </Link>
          <Link href="/search" className="inline-block p-2 hover:underline">
            Search
          </Link>
          <Link href="/settings" className="inline-block p-2 hover:underline">
            Settings
          </Link>
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
        </nav>
      </footer>
    </>
  );
}
