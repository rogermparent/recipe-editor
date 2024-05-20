// packages/component-library/components/Form/inputs/Markdown/index.tsx
"use client";

import { ChangeEventHandler, useState } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";
import StyledMarkdown from "component-library/components/Markdown";
import { Button } from "component-library/components/Button";

export function MarkdownInput({
  name,
  id = name,
  defaultValue,
  onChange,
  label,
  errors,
}: {
  name?: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  errors?: string[];
}) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [value, setValue] = useState(defaultValue || "");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onChange?.(event);
  };

  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <div className="flex flex-col border rounded">
        <div className="flex border-b">
          <Button
            className={clsx(
              activeTab === "edit" ? "bg-blue-500 text-white" : "",
              "px-4 py-2 rounded-tl",
            )}
            onClick={() => setActiveTab("edit")}
          >
            Write
          </Button>
          <Button
            className={clsx(
              activeTab === "preview" ? "bg-blue-500 text-white" : "",
              "px-4 py-2 rounded-tr",
            )}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </Button>
        </div>
        <div className={activeTab === "edit" ? "" : "hidden"}>
          <textarea
            name={name}
            id={id}
            className={clsx(baseInputStyle, "px-1 h-40 grow w-full")}
            value={value}
            onChange={handleChange}
          />
        </div>
        {activeTab === "preview" ? (
          <div className={"p-2 markdown-body"}>
            <StyledMarkdown>{value}</StyledMarkdown>
          </div>
        ) : null}
      </div>
    </FieldWrapper>
  );
}
