"use client";

import {
  DefaultControls,
  FormatButton,
  MarkdownControlsProps,
  MarkdownInput,
  MarkdownInputProps,
  wrapSelection,
} from "component-library/components/Form/inputs/Markdown";
import { MouseEventHandler } from "react";

function HighlightControl({ textArea }: MarkdownControlsProps) {
  const handleHighlightClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "<mark>",
      suffix: "</mark>",
      textArea,
    });
  };

  return (
    <FormatButton onClick={handleHighlightClick}>
      <mark className="text-sm block mx-auto h-4 w-4 leading-none rounded">
        H
      </mark>
    </FormatButton>
  );
}

function DetailsControl({ textArea }: MarkdownControlsProps) {
  const handleDetailsClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const { selectionStart } = textArea;

      const prefix = `<details>\n<summary></summary>\n`;
      const suffix = `\n</details>`;
      const newSelectionStart = selectionStart + 19;
      const newSelectionEnd = newSelectionStart;

      wrapSelection({
        prefix,
        suffix,
        textArea,
        reselect: false,
      });
      textArea.focus();
      textArea.setSelectionRange(newSelectionStart, newSelectionEnd);
    }
  };

  return (
    <FormatButton onClick={handleDetailsClick}>
      <span className="text-xs">Dtl</span>
    </FormatButton>
  );
}

function CustomControls({ textArea }: MarkdownControlsProps) {
  return (
    <>
      <DefaultControls textArea={textArea} />
      <HighlightControl textArea={textArea} />
      <DetailsControl textArea={textArea} />
    </>
  );
}

export default function HomepageMarkdownInput({
  name,
  id,
  label,
  defaultValue,
  errors,
}: MarkdownInputProps) {
  return (
    <MarkdownInput
      name={name}
      id={id}
      label={label}
      defaultValue={defaultValue}
      errors={errors}
      Controls={CustomControls}
    />
  );
}
