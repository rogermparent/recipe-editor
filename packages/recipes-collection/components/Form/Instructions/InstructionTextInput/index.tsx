"use client";

import {
  DefaultControls,
  FormatButton,
  MarkdownControlsProps,
  MarkdownInputProps,
  wrapSelection,
} from "component-library/components/Form/inputs/Markdown/common";
import { MarkdownInput } from "component-library/components/Form/inputs/Markdown";
import { InstructionControls } from "../../RecipeMarkdown";
import { Dispatch } from "react";
import { KeyListAction } from "component-library/components/Form/inputs/List";

function InstructionControl({ textArea }: MarkdownControlsProps) {
  // Add any custom controls specific to instructions here
  return <DefaultControls textArea={textArea} />;
}

export default function InstructionTextInput({
  name,
  id,
  label,
  defaultValue,
  errors,
  dispatch,
  index
}: MarkdownInputProps & {
  dispatch: Dispatch<KeyListAction>;
  index: number;
  toggleIsGroup: () => void;
}) {
  return (
    <MarkdownInput
      name={name}
      id={id}
      label={label}
      defaultValue={defaultValue}
      errors={errors}
      Controls={InstructionControl}
    />
  );
}
