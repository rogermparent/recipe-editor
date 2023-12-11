import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { signOut } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My LMDB-powered Blog",
  description: "A minimal blog powered by LMDB and the filesystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          "bg-slate-950 flex flex-col flex-nowrap items-center min-w-fit",
        )}
      >
        <header className="w-full bg-slate-800">
          <Link href="/" className="block p-2">
            <h1 className="text-xl font-bold text-center">
              My LMDB-powered Blog
            </h1>
          </Link>
        </header>
        {children}
        <footer className="w-full bg-slate-800">
          <nav className="flex flex-row justify-center">
            <Link href="/settings" className="inline-block p-2">
              Settings
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button>Sign Out</Button>
            </form>
          </nav>
        </footer>
      </body>
    </html>
  );
}
