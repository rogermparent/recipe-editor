import { ChangeEventHandler, ReactNode, useMemo, useState } from "react";
import clsx from "clsx";

const baseInputStyle =
  "text-black bg-slate-100 border border-slate-600 rounded-md";

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
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
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-nowrap mb-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function Errors({ errors }: { errors?: string[] }) {
  return (
    <div id="customer-error" aria-live="polite" aria-atomic="true">
      {errors &&
        errors.map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
    </div>
  );
}

export function TextInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
  errors,
}: {
  name: string;
  id: string;
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
        type="text"
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

export function PasswordInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
  errors,
}: {
  name: string;
  id: string;
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
  id,
  defaultValue,
  onChange,
  label,
  errors,
}: {
  name: string;
  id: string;
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

export function DateTimeInput({
  name,
  id,
  date,
  label,
  currentTimezone,
  errors,
}: {
  name: string;
  id: string;
  label: string;
  date?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  currentTimezone?: string;
  errors?: string[];
}) {
  const [currentDate, setCurrentDate] = useState(date);
  const dateObject =
    currentDate === undefined ? undefined : new Date(currentDate);
  return (
    <FieldWrapper label={label} id={id}>
      <Errors errors={errors} />
      <input
        step="any"
        name={name}
        id={id}
        className={clsx(baseInputStyle, "p-1")}
        type="datetime-local"
        defaultValue={dateObject?.toISOString().slice(0, -1) || undefined}
        onChange={(e) => {
          const value = e.target?.value;
          if (value) {
            const parsedDate = Date.parse(value + "Z");
            if (!Number.isNaN(parsedDate)) {
              setCurrentDate(parsedDate);
              return undefined;
            }
          }
          setCurrentDate(undefined);
        }}
      />
      <div className="text-sm font-semibold italic h-4 my-0.5">
        {currentTimezone && currentDate && (
          <>
            {dateObject?.toLocaleString()} ({currentTimezone})
          </>
        )}
      </div>
    </FieldWrapper>
  );
}

export function FileInput({
  name,
  id,
  defaultValue,
  onChange,
  label,
  placeholder,
  errors,
}: {
  name: string;
  id: string;
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
