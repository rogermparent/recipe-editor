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

function HighlightControl({
  textArea,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleHighlightClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "<mark>",
      suffix: "</mark>",
      textArea,
      setSelectionRange,
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

function DetailsControl({
  textArea,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleDetailsClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const { selectionStart } = textArea;

      const prefix = `<details>\n<summary></summary>\n`;
      const suffix = `\n</details>`;
      const newSelectionStart = selectionStart + 19; // After <summary>
      const newSelectionEnd = newSelectionStart;

      wrapSelection({
        prefix,
        suffix,
        textArea,
        setSelectionRange,
        reselect: false,
      });
      setSelectionRange({
        selectionStart: newSelectionStart,
        selectionEnd: newSelectionEnd,
      });
    }
  };

  return (
    <FormatButton onClick={handleDetailsClick}>
      <span className="text-xs">Dtl</span>
    </FormatButton>
  );
}

function CustomControls({
  textArea,
  setSelectionRange,
}: MarkdownControlsProps) {
  return (
    <>
      <DefaultControls
        textArea={textArea}
        setSelectionRange={setSelectionRange}
      />
      <HighlightControl
        textArea={textArea}
        setSelectionRange={setSelectionRange}
      />
      <DetailsControl
        textArea={textArea}
        setSelectionRange={setSelectionRange}
      />
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
