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

export function HighlightControl({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  const handleHighlightClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "<mark>",
      suffix: "</mark>",
      textArea,
      setValue,
      setSelectionRange,
    });
  };

  return (
    <FormatButton onClick={handleHighlightClick}>
      <mark className="bg-yellow-200">H</mark>
    </FormatButton>
  );
}

export function DetailsControl({
  textArea,
  setValue,
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
        setValue,
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

export function CustomControls({
  textArea,
  setValue,
  setSelectionRange,
}: MarkdownControlsProps) {
  return (
    <>
      <DefaultControls
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <HighlightControl
        textArea={textArea}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
      />
      <DetailsControl
        textArea={textArea}
        setValue={setValue}
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
