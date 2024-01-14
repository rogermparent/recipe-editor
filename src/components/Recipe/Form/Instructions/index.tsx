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
} from "@/components/Form";
import {
  InputListControls,
  KeyListAction,
  useKeyList,
} from "@/components/Form/List";
import { Dispatch, useState } from "react";

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
      />
      <TextAreaInput
        label="Text"
        name={`${itemKey}.text`}
        defaultValue={currentDefaultItem?.text}
      />
    </div>
  );
}

function InstructionGroupInput({
  currentDefaultItem,
  itemKey,
}: {
  currentDefaultItem?: InstructionGroup;
  itemKey: string;
}) {
  const [{ keys, defaultValues }, dispatch] = useKeyList<InstructionEntry>(
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
          {keys.map((key, index) => {
            const childItemKey = `${itemKey}.instructions[${index}]`;
            const currentDefaultItem = defaultValues?.[index] as
              | Instruction
              | undefined;
            return (
              <li key={key}>
                <InstructionInput
                  currentDefaultItem={currentDefaultItem}
                  itemKey={childItemKey}
                />
              </li>
            );
          })}
        </ul>
      </FieldWrapper>
      <Button
        onClick={() => {
          dispatch({ type: "APPEND" });
        }}
      >
        Append
      </Button>
    </div>
  );
}

function InstructionEntryInput({
  currentDefaultItem,
  itemKey,
  index,
  dispatch,
}: {
  currentDefaultItem?: InstructionEntry;
  itemKey: string;
  index: number;
  dispatch: Dispatch<KeyListAction>;
}) {
  const [isGroup, setIsGroup] = useState(
    Boolean(currentDefaultItem && "instructions" in currentDefaultItem),
  );
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
          currentDefaultItem={currentDefaultItem as InstructionGroup}
          itemKey={itemKey}
        />
      ) : (
        <InstructionInput
          currentDefaultItem={currentDefaultItem as Instruction}
          itemKey={itemKey}
        />
      )}
      <div>
        <InputListControls dispatch={dispatch} index={index} />
      </div>
    </li>
  );
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
  const [{ keys, defaultValues }, dispatch] =
    useKeyList<InstructionEntry>(defaultValue);
  return (
    <FieldWrapper label={label} id={id}>
      <ul>
        {keys.map((key, index) => {
          const itemKey = `${name}[${index}]`;
          const currentDefaultItem = defaultValues?.[index];
          return (
            <InstructionEntryInput
              key={key}
              currentDefaultItem={currentDefaultItem}
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
