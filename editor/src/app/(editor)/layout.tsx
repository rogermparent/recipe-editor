import Link from "next/link";
import { ReactNode } from "react";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="w-full bg-slate-800 print:hidden border-t border-slate-700">
        <nav className="flex flex-row flex-wrap justify-center">
          <Link href="/menus" className="inline-block p-2 hover:underline">
            Menus
          </Link>
          <Link href="/pages" className="inline-block p-2 hover:underline">
            Pages
          </Link>
          <Link href="/export" className="inline-block p-2 hover:underline">
            Export
          </Link>
        </nav>
      </footer>
    </>
  );
}
