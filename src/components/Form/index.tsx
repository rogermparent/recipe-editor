import {
  ChangeEventHandler,
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
  useState,
} from "react";
import clsx from "clsx";
import { Button } from "../Button";
import { ResumeFormErrors } from "@/app/lib/models/resumes/formState";

const baseInputStyle =
  "text-black bg-slate-100 border border-slate-600 rounded-md w-full";

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
  label: string;
  id?: string;
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

interface KeyListState {
  currentKey: number;
  keys: number[];
  defaultValues?: string[];
}

type KeyListAction =
  | { type: "APPEND" }
  | { type: "MOVE"; from: number; to: number }
  | { type: "DELETE"; index: number }
  | { type: "INSERT"; index: number };

function reduceKeyList(state: KeyListState, action: KeyListAction) {
  const { currentKey, keys } = state;
  switch (action.type) {
    case "APPEND":
      return {
        currentKey: currentKey + 1,
        keys: [...keys, currentKey],
      };
    case "INSERT": {
      const { index } = action;
      return {
        currentKey: currentKey + 1,
        keys: [...keys.slice(0, index), currentKey, ...keys.slice(index)],
      };
    }
    case "MOVE": {
      const { from: fromIndex, to: toIndex } = action;
      if (fromIndex === toIndex) {
        return state;
      }
      const newKeys = [...keys];
      const keyToMove = keys[fromIndex];
      newKeys.splice(fromIndex, 1);
      newKeys.splice(toIndex, 0, keyToMove);
      return {
        currentKey,
        keys: newKeys,
      };
    }
    case "DELETE": {
      const { index } = action;
      return {
        currentKey,
        keys: [...keys.slice(0, index), ...keys.slice(index + 1)],
      };
    }
  }
}

export function useKeyList(defaultValues?: string[] | undefined) {
  return useReducer(
    reduceKeyList,
    { currentKey: 0, keys: [] } as KeyListState,
    (initialArg) => {
      if (defaultValues && defaultValues.length > 0) {
        const keys = [];
        for (let i = 0; i < defaultValues.length; i++) {
          keys.push(i);
        }
        return {
          currentKey: defaultValues.length,
          keys,
          defaultValues,
        } as KeyListState;
      }
      return initialArg;
    },
  );
}

export function InputListControls({
  dispatch,
  index,
}: {
  dispatch: Dispatch<KeyListAction>;
  index: number;
}) {
  return (
    <>
      <Button
        className="ml-0.5 w-8"
        onClick={() => {
          dispatch({ type: "INSERT", index });
        }}
      >
        +
      </Button>
      <Button
        className="ml-0.5 w-8"
        onClick={() => {
          dispatch({ type: "MOVE", from: index, to: index - 1 });
        }}
      >
        &uarr;
      </Button>
      <Button
        className="ml-0.5 w-8"
        onClick={() => {
          dispatch({ type: "MOVE", from: index, to: index + 1 });
        }}
      >
        &darr;
      </Button>
      <Button
        className="ml-0.5 w-8"
        onClick={() => {
          dispatch({ type: "DELETE", index });
        }}
      >
        &times;
      </Button>
    </>
  );
}

export function TextListInput({
  name,
  id,
  defaultValue,
  label,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: string[];
  placeholder?: string;
  errors?: ResumeFormErrors | undefined;
}) {
  const [{ keys, defaultValues }, dispatch] = useKeyList(defaultValue);
  console.log({ keys, defaultValues });
  return (
    <FieldWrapper label={label} id={id}>
      <ul>
        {keys.map((key, index) => (
          <li key={key} className="flex flex-row my-1">
            <input
              type="text"
              defaultValue={defaultValues?.[index]}
              className={clsx(baseInputStyle, "px-1")}
              name={`${name}[${index}]`}
            />
            <InputListControls dispatch={dispatch} index={index} />
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          dispatch({ type: "APPEND" });
        }}
      >
        Append Item
      </Button>
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
