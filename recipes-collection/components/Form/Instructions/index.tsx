import { RecipeFormErrors } from "../../../controller/formState";
import {
  Instruction,
  InstructionEntry,
  InstructionGroup,
} from "../../../controller/types";
import { Button } from "component-library/Button";
import { FieldWrapper, baseInputStyle } from "component-library/Form";
import {
  InputListControls,
  KeyListAction,
  useKeyList,
} from "component-library/Form/inputs/List";
import { SelectInput } from "component-library/Form/inputs/Select";
import { TextInput } from "component-library/Form/inputs/Text";
import { TextAreaInput } from "component-library/Form/inputs/TextArea";
import clsx from "clsx";
import { Dispatch, useEffect, useRef, useState } from "react";

function InstructionInput({
  currentDefaultItem,
  itemKey,
  index,
  dispatch,
}: {
  currentDefaultItem?: Instruction;
  itemKey: string;
  index: number;
  dispatch: Dispatch<KeyListAction>;
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
      <div className="flex flex-row flex-nowrap justify-center">
        <InputListControls dispatch={dispatch} index={index} />
      </div>
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
        <div className="pl-2 ml-0.5 border-l-2 border-white">
          <ul>
            {values.map(({ key, defaultValue }, index) => {
              const childItemKey = `${itemKey}.instructions[${index}]`;
              return (
                <li key={key}>
                  <InstructionInput
                    currentDefaultItem={defaultValue as Instruction}
                    itemKey={childItemKey}
                    index={index}
                    dispatch={childDispatch}
                  />
                </li>
              );
            })}
          </ul>
          <Button
            className="mx-0.5 my-1 w-full"
            onClick={() => {
              childDispatch({ type: "APPEND" });
            }}
          >
            Append
          </Button>
        </div>
      </FieldWrapper>
      <div className="flex flex-row flex-nowrap justify-center">
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
          dispatch={dispatch}
          index={index}
        />
      )}
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
        className="mx-0.5 my-1 w-full"
        onClick={() => {
          dispatch({ type: "APPEND" });
        }}
      >
        Append
      </Button>
    </FieldWrapper>
  );
}
