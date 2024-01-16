import { RecipeFormErrors } from "@/app/lib/models/recipes/formState";
import { Ingredient } from "@/app/lib/models/recipes/types";
import { createIngredients } from "@/app/lib/parseIngredients";
import { Button } from "@/components/Button";
import {
  FieldWrapper,
  TextAreaInput,
  TextInput,
  baseInputStyle,
} from "@/components/Form";
import { InputListControls, useKeyList } from "@/components/Form/List";
import clsx from "clsx";
import { useRef, useState } from "react";

export function IngredientsListInput({
  name,
  id,
  defaultValue,
  label,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: Ingredient[];
  placeholder?: string;
  errors?: RecipeFormErrors | undefined;
}) {
  const [{ keys, defaultValues }, dispatch] =
    useKeyList<Ingredient>(defaultValue);
  const importTextareaRef = useRef<HTMLTextAreaElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  return (
    <FieldWrapper label={label} id={id}>
      <details ref={detailsRef}>
        <summary>Import</summary>
        <textarea
          ref={importTextareaRef}
          className={clsx(baseInputStyle, "w-full h-36")}
        />
        <div className="my-1 flex flex-row">
          <Button
            onClick={() => {
              const value = importTextareaRef.current?.value;
              dispatch({
                type: "RESET",
                values: value ? createIngredients(value) : [],
              });
              if (detailsRef.current) {
                detailsRef.current.open = false;
              }
            }}
          >
            Submit
          </Button>
        </div>
      </details>
      <ul>
        {keys.map((key, index) => {
          const itemKey = `${name}[${index}]`;
          const currentDefaultItem = defaultValues?.[index];
          return (
            <li key={key} className="flex flex-col my-1">
              <div>
                <TextInput
                  name={`${itemKey}.quantity`}
                  defaultValue={currentDefaultItem?.quantity}
                />
                <TextInput
                  name={`${itemKey}.unit`}
                  defaultValue={currentDefaultItem?.unit}
                />
                <TextInput
                  name={`${itemKey}.ingredient`}
                  defaultValue={currentDefaultItem?.ingredient}
                />
              </div>
              <div>
                <InputListControls dispatch={dispatch} index={index} />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="my-1 flex flex-row">
        <Button
          onClick={() => {
            dispatch({ type: "APPEND" });
          }}
        >
          Append
        </Button>
      </div>
    </FieldWrapper>
  );
}
