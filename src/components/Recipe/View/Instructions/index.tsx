"use client";

import { InstructionEntry } from "@/app/lib/models/recipes/types";

import Markdown from "@/components/Markdown";

const headingStyle = "text-lg font-bold my-2 border-b border-white";

export const InstructionEntryView = ({
  entry,
}: {
  entry: InstructionEntry;
}) => {
  if ("instructions" in entry) {
    const { name, instructions } = entry;
    return (
      <li className="my-3 list-none">
        {name && <h3 className={headingStyle}>{name}</h3>}
        <ol className="list-decimal pl-1 sm:pl-3 md:pl-4">
          {instructions.map(({ name, text }, i) => (
            <li key={i} className="my-2">
              {name && <h4>{name}</h4>}
              <Markdown>{text}</Markdown>
            </li>
          ))}
        </ol>
      </li>
    );
  } else {
    const { name, text } = entry;
    return (
      <li className="my-3">
        {name && <h3 className={headingStyle}>{name}</h3>}
        <Markdown>{text}</Markdown>
      </li>
    );
  }
};
