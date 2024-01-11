import { RecipeFormErrors } from "@/app/lib/models/recipes/formState";
import { Ingredient } from "@/app/lib/models/recipes/types";
import { Button } from "@/components/Button";
import { FieldWrapper, TextInput } from "@/components/Form";
import { InputListControls, useKeyList } from "@/components/Form/List";

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
