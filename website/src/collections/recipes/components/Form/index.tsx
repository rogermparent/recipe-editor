"use client";

import { useEffect, useMemo, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { Recipe } from "@/collections/recipes/controller/types";
import { RecipeFormState } from "@/collections/recipes/controller/formState";
import createDefaultSlug from "@/collections/recipes/controller/createSlug";
import { IngredientsListInput } from "@/collections/recipes/components/Form/Ingredients";
import { InstructionsListInput } from "@/collections/recipes/components/Form/Instructions";
import { DateTimeInput } from "@/components/Form/inputs/DateTime";
import { ImageInput } from "@/components/Form/inputs/Image";
import { TextInput } from "@/components/Form/inputs/Text";
import { TextAreaInput } from "@/components/Form/inputs/TextArea";

export default function CreateRecipeFields({
  recipe,
  slug,
  state,
}: {
  recipe?: Partial<Recipe>;
  slug?: string;
  state: RecipeFormState;
}) {
  const { name, date, description, ingredients, instructions, image } =
    recipe || {};
  const [currentName, setCurrentName] = useState(name);
  const defaultSlug = useMemo(
    () => slugify(createDefaultSlug({ name: currentName || "" })),
    [currentName],
  );
  const [currentTimezone, setCurrentTimezone] = useState<string>();

  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);

  return (
    <>
      <TextInput
        label="Name"
        name="name"
        id="recipe-form-name"
        defaultValue={name}
        onChange={(e) => setCurrentName(e.target.value)}
        errors={state.errors?.name}
      />
      <TextAreaInput
        label="Description"
        name="description"
        id="recipe-form-description"
        defaultValue={description}
        errors={state.errors?.description}
      />
      <ImageInput image={image} errors={state.errors?.image} slug={slug} />
      <IngredientsListInput
        label="Ingredients"
        name="ingredients"
        id="recipe-form-ingredients"
        defaultValue={ingredients}
        errors={state.errors}
      />
      <InstructionsListInput
        label="Instructions"
        name="instructions"
        id="recipe-form-instructions"
        defaultValue={instructions}
        errors={state.errors}
      />
      <details className="py-1 my-1" open>
        <summary className="text-sm font-semibold">Advanced</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Slug"
            name="slug"
            id="recipe-form-slug"
            defaultValue={slug}
            placeholder={defaultSlug}
            errors={state.errors?.slug}
          />
          <DateTimeInput
            label="Date (UTC)"
            name="date"
            id="recipe-form-date"
            date={date}
            currentTimezone={currentTimezone}
            errors={state.errors?.date}
          />
        </div>
      </details>
    </>
  );
}
