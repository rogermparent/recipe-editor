import React from "react";
import { DocPage } from "@/app/lib/models/docPages/types";
import Markdown from "@/components/Markdown";

export const DocPageView = ({ docPage }: { readonly docPage?: DocPage }) => {
  const { body = "", name } = docPage || {};
  return (
    <div className="w-full h-full p-2 print:p-0 grow flex flex-col flex-nowrap max-w-prose">
      <div className="text-lg border-b mb-2">{name}</div>
      <Markdown>{body}</Markdown>
    </div>
  );
};
