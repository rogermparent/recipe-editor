import { ChangeEventHandler } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";

export function CheckboxInput({
  name,
  id = name,
  defaultChecked,
  onChange,
  label,
  placeholder,
  errors,
  list,
}: {
  name: string;
  id?: string;
  label?: string;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  errors?: string[];
  list?: string;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        type="checkbox"
        name={name}
        id={id}
        className={clsx(baseInputStyle)}
        defaultChecked={defaultChecked}
        onChange={onChange}
        placeholder={placeholder}
        list={list}
      />
    </FieldWrapper>
  );
}
