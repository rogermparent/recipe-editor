import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "A minimal resume builder powered by LMDB and the filesystem.",
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
          "bg-slate-950 flex flex-col flex-nowrap items-center min-w-fit",
        )}
      >
        {children}
      </body>
    </html>
  );
}
