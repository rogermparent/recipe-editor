import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import Link from "next/link";
import getMenuBySlug from "menus-collection/controller/data/read";

export const metadata: Metadata = {
  title: "Recipe Editor",
  description: "A recipe book app built with Next 14.",
};

async function SiteHeader() {
  const response = await getMenuBySlug("header");
  const items = response?.items;

  return (
    <header className="w-full bg-slate-800 print:hidden border-b border-slate-700">
      <Link href="/" className="block p-2">
        <h1 className="text-xl font-bold text-center">Recipe Editor</h1>
      </Link>
      <nav className="text-center">
        {items?.map(({ href, name }) => {
          return (
            <Link
              key={href}
              href={href}
              className="p-1 inline-block hover:underline"
            >
              {name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

async function SiteFooter() {
  return (
    <footer className="w-full bg-slate-800 print:hidden border-t border-slate-700">
      <nav className="flex flex-row flex-wrap justify-center">
        <Link href="/search" className="inline-block p-2 hover:underline">
          Search
        </Link>
      </nav>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "bg-slate-950 flex flex-col flex-nowrap items-center min-w-fit",
        )}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
