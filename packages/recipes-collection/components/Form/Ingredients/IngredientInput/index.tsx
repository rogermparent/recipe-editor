"use client";

import { InlineMarkdownInput } from "component-library/components/Form/inputs/Markdown/Inline";
import {
  DefaultControls,
  FormatButton,
  MarkdownControlsProps,
  MarkdownInputProps,
  wrapSelection,
} from "component-library/components/Form/inputs/Markdown/common";

function MultiplyableControl({ textArea }: MarkdownControlsProps) {
  const handleMultiplyableClick = () => {
    wrapSelection({
      prefix: `<Multiplyable baseNumber="`,
      suffix: `" />`,
      textArea,
    });
  };

  return (
    <FormatButton onClick={handleMultiplyableClick}>
      <span>&times;</span>
    </FormatButton>
  );
}

function CustomControls({ textArea }: MarkdownControlsProps) {
  return (
    <>
      <MultiplyableControl textArea={textArea} />
      <DefaultControls textArea={textArea} />
    </>
  );
}

export default function IngredientInput({
  name,
  id,
  label,
  defaultValue,
  errors,
}: MarkdownInputProps) {
  return (
    <InlineMarkdownInput
      name={name}
      id={id}
      label={label}
      defaultValue={defaultValue}
      errors={errors}
      Controls={CustomControls}
    />
  );
}
