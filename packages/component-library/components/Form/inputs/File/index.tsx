import { ChangeEventHandler, forwardRef, ForwardedRef } from "react";
import clsx from "clsx";
import { Errors, FieldWrapper, baseInputStyle } from "../..";

function FileInputComponent(
  {
    name,
    id = name,
    defaultValue,
    onChange,
    label,
    placeholder,
    errors,
  }: {
    name: string;
    id?: string;
    label: string;
    defaultValue?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    errors?: string[];
  },
  ref?: ForwardedRef<HTMLInputElement>,
) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <div className={clsx(baseInputStyle, "p-1")}>
        <input
          type="file"
          name={name}
          id={id}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
        />
      </div>
    </FieldWrapper>
  );
}

export const FileInput = forwardRef(FileInputComponent);
