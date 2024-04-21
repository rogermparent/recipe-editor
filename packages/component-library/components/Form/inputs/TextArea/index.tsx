import { ChangeEventHandler } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";

export function TextAreaInput({
  name,
  id = name,
  defaultValue,
  onChange,
  label,
  errors,
}: {
  name?: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  errors?: string[];
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <textarea
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-1 h-40 grow")}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </FieldWrapper>
  );
}
