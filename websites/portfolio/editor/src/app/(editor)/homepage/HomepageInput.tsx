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
