import { ChangeEventHandler, ReactNode } from "react";
import { Errors, FieldWrapper, baseInputStyle } from "../..";
import clsx from "clsx";

export function SelectInput({
  name,
  id = name,
  defaultValue,
  label,
  errors,
  children,
  onChange,
}: {
  name?: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  errors?: string[];
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <select
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-2 py-1")}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
