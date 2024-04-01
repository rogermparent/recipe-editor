import Link from "next/link";
import { readFile } from "fs/promises";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import { join } from "path";

interface NavItem {
  href: string;
  name: string;
}

export async function SiteHeader() {
  const headerNavData = JSON.parse(
    String(
      await readFile(
        join(getContentDirectory(), "settings", "nav", "header.json"),
      ),
    ),
  ) as NavItem[] | undefined;
  return (
    <header className="w-full bg-slate-800 print:hidden">
      <Link href="/" className="block p-2">
        <h1 className="text-xl font-bold text-center">Recipe Editor</h1>
      </Link>
      <nav className="text-center">
        {headerNavData?.map(({ href, name }) => {
          return (
            <Link key={href} href={href}>
              {name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
