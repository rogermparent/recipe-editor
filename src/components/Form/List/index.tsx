import { Dispatch, useReducer } from "react";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { RecipeFormErrors } from "@/app/lib/models/recipes/formState";
import { FieldWrapper, baseInputStyle } from "..";

interface KeyListState<T = any> {
  currentKey: number;
  keys: number[];
  defaultValues?: T[];
}

type KeyListAction =
  | { type: "APPEND" }
  | { type: "MOVE"; from: number; to: number }
  | { type: "DELETE"; index: number }
  | { type: "INSERT"; index: number };

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

function reduceKeyList<T>(state: KeyListState<T>, action: KeyListAction) {
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

export function useKeyList<T = string>(defaultValues?: T[] | undefined) {
  return useReducer(
    reduceKeyList<T>,
    { currentKey: 0, keys: [] } as KeyListState<T>,
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

export function TextListInput({
  name,
  id = name,
  defaultValue,
  label,
  appendLabel = "Append Item",
}: {
  name: string;
  id?: string;
  label: string;
  defaultValue?: string[];
  placeholder?: string;
  errors?: RecipeFormErrors | undefined;
  appendLabel?: string;
}) {
  const [{ keys, defaultValues }, dispatch] = useKeyList(defaultValue);
  return (
    <FieldWrapper label={label} id={id}>
      <ul>
        {keys.map((key, index) => (
          <li
            key={key}
            className="flex flex-row flex-wrap my-1 justify-center items-center"
          >
            <input
              type="text"
              defaultValue={defaultValues?.[index]}
              className={clsx(baseInputStyle, "px-1 grow")}
              name={`${name}[${index}]`}
            />
            <div className="flex flex-row shrink">
              <InputListControls dispatch={dispatch} index={index} />
            </div>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          dispatch({ type: "APPEND" });
        }}
      >
        {appendLabel}
      </Button>
    </FieldWrapper>
  );
}
