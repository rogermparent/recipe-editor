import { ChangeEventHandler, ReactNode } from "react";
import clsx from "clsx";

export const baseInputStyle =
  "text-black bg-slate-100 border border-slate-600 rounded-md";

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="font-semibold text-sm py-1">
      {children}
    </label>
  );
}

export function FieldWrapper({
  label,
  id,
  children,
}: {
  label?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-nowrap mb-1">
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
    </div>
  );
}

export function Errors({ errors }: { errors?: string[] }) {
  return (
    errors && (
      <div aria-live="polite" aria-atomic="true">
        {errors &&
          errors.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    )
  );
}

export function TextInput({
  name,
  id = name,
  defaultValue,
  onChange,
  label,
  placeholder,
  errors,
  list,
}: {
  name: string;
  id?: string;
  label?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  errors?: string[];
  list?: string;
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        type="text"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-2 py-1")}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        list={list}
      />
    </FieldWrapper>
  );
}

export function PasswordInput({
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
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        type="password"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-2 py-1")}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
}

export function TextAreaInput({
  name,
  id = name,
  defaultValue,
  onChange,
  label,
  errors,
}: {
  name: string;
  id?: string;
  label: string;
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

export function DateInput({
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
}) {
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        type="date"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "px-2 py-1")}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
}

export function FileInput({
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
}) {
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
        />
      </div>
    </FieldWrapper>
  );
}

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
