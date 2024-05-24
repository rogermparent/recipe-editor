"use client";

import {
  FormatButton,
  MarkdownControlsProps,
  MarkdownInputProps,
  wrapSelection,
} from "../common";
import clsx from "clsx";
import { MouseEventHandler, useState } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../../..";
import { DefaultControls } from "../";
import StyledMarkdown from "component-library/components/Markdown";

export function InlineMarkdownInput({
  name,
  id = name,
  defaultValue,
  label,
  errors,
  Controls = DefaultControls,
}: MarkdownInputProps) {
  const [preview, setPreview] = useState(false);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const togglePreview: MouseEventHandler<HTMLButtonElement> = () => {
    setPreview(!preview);
  };

  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <div className="flex gap-2 border rounded">
        <input
          name={name}
          id={id}
          ref={(el) => {
            setInput(el);
          }}
          className={clsx(baseInputStyle, "grow")}
          defaultValue={defaultValue}
        />
        <FormatButton
          aria-label={preview ? "Edit" : "Preview"}
          onClick={togglePreview}
        >
          {preview ? (
            <span className="font-mono text-xs">{"</>"}</span>
          ) : (
            <span>👁️</span>
          )}
        </FormatButton>
      </div>
      {preview ? (
        <div className="p-2 markdown-body">
          <StyledMarkdown>{input?.value || ""}</StyledMarkdown>
        </div>
      ) : (
        <div className="flex gap-2 border-t p-2">
          <Controls input={input} />
        </div>
      )}
    </FieldWrapper>
  );
}
