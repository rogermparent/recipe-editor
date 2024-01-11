import { RecipeFormErrors } from "@/app/lib/models/recipes/formState";
import { Instruction } from "@/app/lib/models/recipes/types";
import { Button } from "@/components/Button";
import { FieldWrapper, TextAreaInput, TextInput } from "@/components/Form";
import { InputListControls, useKeyList } from "@/components/Form/List";

export function InstructionsListInput({
  name,
  id,
  defaultValue,
  label,
}: {
  name: string;
  id: string;
  label: string;
  defaultValue?: Instruction[];
  placeholder?: string;
  errors?: RecipeFormErrors | undefined;
}) {
  const [{ keys, defaultValues }, dispatch] =
    useKeyList<Instruction>(defaultValue);
  return (
    <FieldWrapper label={label} id={id}>
      <ul>
        {keys.map((key, index) => {
          const itemKey = `${name}[${index}]`;
          const currentDefaultItem = defaultValues?.[index];
          return (
            <li key={key} className="flex flex-col my-1">
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
              <div>
                <InputListControls dispatch={dispatch} index={index} />
              </div>
            </li>
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
