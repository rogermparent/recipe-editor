"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsMenu = [
  { href: "/settings", name: "Settings" },
  { href: "/menus", name: "Menus" },
  { href: "/pages", name: "Pages" },
  { href: "/export", name: "Export" },
];

export default function SettingsFooter() {
  const pathname = usePathname();
  return (
    <footer className="w-full bg-slate-800 print:hidden border-t border-slate-700">
      <nav className="flex flex-row flex-wrap justify-center">
        {settingsMenu.map(({ href, name }) => (
          <Link
            key={href}
            href={href}
            className={`inline-block p-2 hover:underline${href.startsWith(pathname) ? " font-bold" : ""}`}
          >
            {name}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
