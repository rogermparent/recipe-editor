import HomePage from "portfolio-website-common/components/Homepage";
import Link from "next/link";

export { generateMetadata } from "portfolio-website-common/components/Homepage";

export default function EditorHomePage() {
  return (
    <>
      <HomePage />
      <footer className="w-full bg-slate-800 print:hidden border-t border-slate-700">
        <nav className="flex flex-row flex-wrap justify-center">
          <Link href="/homepage" className="p-2">
            Edit Homepage
          </Link>
        </nav>
      </footer>
    </>
  );
}
