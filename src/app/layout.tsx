import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My LMDB-powered Blog",
  description: "A minimal blog powered by LMDB and the filesystem.",
};

export default async function RootLayout({
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
        {children}
      </body>
    </html>
  );
}
