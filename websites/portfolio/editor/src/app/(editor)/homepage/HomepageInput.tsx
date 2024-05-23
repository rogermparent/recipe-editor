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
  textAreaRef,
  setValue,
  setSelectionRange,
  onChange,
}: MarkdownControlsProps) {
  const textArea = textAreaRef.current;

  const handleHighlightClick: MouseEventHandler<HTMLButtonElement> = () => {
    wrapSelection({
      prefix: "<mark>",
      suffix: "</mark>",
      textArea,
      setValue,
      setSelectionRange,
      onChange,
    });
  };

  return (
    <FormatButton onClick={handleHighlightClick}>
      <mark className="bg-yellow-200">H</mark>
    </FormatButton>
  );
}

export function DetailsControl({
  textAreaRef,
  setValue,
  setSelectionRange,
  onChange,
}: MarkdownControlsProps) {
  const textArea = textAreaRef.current;

  const handleDetailsClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (textArea) {
      const value = textArea.value;
      const { selectionStart, selectionEnd } = textArea;
      const selectedText = value.substring(selectionStart, selectionEnd);

      const prefix = `<details>\n<summary></summary>\n${selectedText}\n</details>`;
      const newSelectionStart = selectionStart + 10; // After <summary>
      const newSelectionEnd = newSelectionStart;

      wrapSelection({
        prefix,
        suffix: "",
        textArea,
        setValue,
        setSelectionRange,
        onChange,
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
  textAreaRef,
  setValue,
  setSelectionRange,
  onChange,
}: MarkdownControlsProps) {
  return (
    <>
      <DefaultControls
        textAreaRef={textAreaRef}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
        onChange={onChange}
      />
      <HighlightControl
        textAreaRef={textAreaRef}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
        onChange={onChange}
      />
      <DetailsControl
        textAreaRef={textAreaRef}
        setValue={setValue}
        setSelectionRange={setSelectionRange}
        onChange={onChange}
      />
    </>
  );
}

export default function HomepageMarkdownInput({
  name,
  id,
  label,
  defaultValue,
  onChange,
  errors,
}: MarkdownInputProps) {
  return (
    <MarkdownInput
      name={name}
      id={id}
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      errors={errors}
      Controls={CustomControls}
    />
  );
}
