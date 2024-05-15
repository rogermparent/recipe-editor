import Markdown, { MarkdownToJSX } from "markdown-to-jsx";
import "github-markdown-css";
import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { Url } from "url";

function MarkdownLink({
  href,
  children,
}: {
  href?: Url | string;
  children?: ReactNode;
}) {
  if (!href) {
    throw new Error("Link given no URL");
  }
  return (
    <Link href={href} target="_blank">
      {children}
    </Link>
  );
}

export default function StyledMarkdown({
  children,
  components,
  forceWrapper,
  className,
}: {
  children: string;
  components?: MarkdownToJSX.Overrides;
  forceWrapper?: boolean;
  className?: string;
}) {
  return (
    <Markdown
      className={clsx("markdown-body", className)}
      options={{
        forceWrapper,
        overrides: {
          a: {
            component: MarkdownLink,
          },
          ...components,
        },
      }}
    >
      {children}
    </Markdown>
  );
}
