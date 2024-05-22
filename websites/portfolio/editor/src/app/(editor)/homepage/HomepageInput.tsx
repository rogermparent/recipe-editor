"use client";

import {
  MarkdownInput,
  MarkdownInputProps,
} from "component-library/components/Form/inputs/Markdown";

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
    />
  );
}
