"use client";

import {
  DefaultControls,
  FormatButton,
  MarkdownControlsProps,
  MarkdownInput,
  MarkdownInputProps,
  wrapSelection,
} from "component-library/components/Form/inputs/Markdown";

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
