import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
      <body className={inter.className}>
        <div className="h-full flex flex-col flex-nowrap items-center min-w-fit">
          <header>
            <Link href="/" className="block p-2">
              <h1 className="text-xl font-bold text-center">
                My LMDB-powered Blog
              </h1>
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
