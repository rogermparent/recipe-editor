import { RecipeFormErrors } from "@/app/lib/models/recipes/formState";
import {
  Instruction,
  InstructionEntry,
  InstructionGroup,
} from "@/app/lib/models/recipes/types";
import { Button } from "@/components/Button";
import {
  FieldWrapper,
  SelectInput,
  TextAreaInput,
  TextInput,
  baseInputStyle,
} from "@/components/Form";
import {
  InputListControls,
  KeyListAction,
  useKeyList,
} from "@/components/Form/List";
import clsx from "clsx";
import { Dispatch, useEffect, useRef, useState } from "react";

function InstructionInput({
  currentDefaultItem,
  itemKey,
}: {
  currentDefaultItem?: Instruction;
  itemKey: string;
}) {
  return (
    <div>
      <TextInput
        label="Name"
        name={`${itemKey}.name`}
        defaultValue={currentDefaultItem?.name}
        key={currentDefaultItem?.name}
      />
      <TextAreaInput
        label="Text"
        name={`${itemKey}.text`}
        defaultValue={currentDefaultItem?.text}
        key={currentDefaultItem?.text}
      />
    </div>
  );
}

function InstructionGroupInput({
  currentDefaultItem,
  itemKey,
  index,
  dispatch,
}: {
  currentDefaultItem?: InstructionGroup;
  itemKey: string;
  index: number;
  dispatch: Dispatch<KeyListAction>;
}) {
  const [{ values }, childDispatch] = useKeyList<InstructionEntry>(
    currentDefaultItem?.instructions,
  );
  return (
    <div>
      <TextInput
        label="Name"
        name={`${itemKey}.name`}
        defaultValue={currentDefaultItem?.name}
      />
      <FieldWrapper label="Children">
        <ul className="pl-2 ml-0.5 border-l-2 border-white">
          {values.map(({ key, defaultValue }, index) => {
            const childItemKey = `${itemKey}.instructions[${index}]`;
            return (
              <li key={key}>
                <InstructionInput
                  currentDefaultItem={defaultValue as Instruction}
                  itemKey={childItemKey}
                />
                <div>
                  <InputListControls dispatch={childDispatch} index={index} />
                </div>
              </li>
            );
          })}
        </ul>
      </FieldWrapper>
      <Button
        onClick={() => {
          childDispatch({ type: "APPEND" });
        }}
      >
        Append
      </Button>
      <div>
        <InputListControls dispatch={dispatch} index={index} />
      </div>
    </div>
  );
}

function entryIsGroup(entry: InstructionEntry | undefined): boolean {
  return Boolean(entry && "instructions" in entry && entry.instructions);
}

function InstructionEntryInput({
  defaultValue,
  itemKey,
  index,
  dispatch,
}: {
  defaultValue?: InstructionEntry;
  itemKey: string;
  index: number;
  dispatch: Dispatch<KeyListAction>;
}) {
  const [isGroup, setIsGroup] = useState(entryIsGroup(defaultValue));
  useEffect(() => {
    setIsGroup(entryIsGroup(defaultValue));
  }, [defaultValue]);
  return (
    <li className="flex flex-col my-1">
      <SelectInput
        name={`${itemKey}.type`}
        label="Type"
        onChange={(e) => setIsGroup(e.target.value === "group" ? true : false)}
        defaultValue={isGroup ? "group" : undefined}
      >
        <option value="step">Step</option>
        <option value="group">Group</option>
      </SelectInput>
      {isGroup ? (
        <InstructionGroupInput
          currentDefaultItem={defaultValue as InstructionGroup}
          itemKey={itemKey}
          dispatch={dispatch}
          index={index}
        />
      ) : (
        <InstructionInput
          currentDefaultItem={defaultValue as Instruction}
          itemKey={itemKey}
        />
      )}
      <div>
        <InputListControls dispatch={dispatch} index={index} />
      </div>
    </li>
  );
}

function parseInstructions(value: string): InstructionEntry[] {
  return value.split(/\n+/).map((instruction) => ({ text: instruction }));
}

export function InstructionsListInput({
  name,
  id,
  defaultValue,
  label,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: InstructionEntry[];
  placeholder?: string;
  errors?: RecipeFormErrors | undefined;
}) {
  const [{ values }, dispatch] = useKeyList<InstructionEntry>(defaultValue);
  const importTextareaRef = useRef<HTMLTextAreaElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  return (
    <FieldWrapper label={label} id={id}>
      <details ref={detailsRef}>
        <summary>Paste</summary>
        <textarea
          ref={importTextareaRef}
          className={clsx(baseInputStyle, "w-full h-36")}
        />
        <div className="my-1 flex flex-row">
          <Button
            onClick={() => {
              const value = importTextareaRef.current?.value;
              const values = value ? parseInstructions(value) : [];
              dispatch({
                type: "RESET",
                values,
              });
              if (detailsRef.current) {
                detailsRef.current.open = false;
              }
            }}
          >
            Import Ingredients
          </Button>
        </div>
      </details>
      <ul>
        {values.map(({ key, defaultValue }, index) => {
          const itemKey = `${name}[${index}]`;
          return (
            <InstructionEntryInput
              key={key}
              defaultValue={defaultValue}
              itemKey={itemKey}
              index={index}
              dispatch={dispatch}
            />
          );
        })}
      </ul>
      <Button
        onClick={() => {
          dispatch({ type: "APPEND" });
        }}
      >
        Append
      </Button>
    </FieldWrapper>
  );
}
