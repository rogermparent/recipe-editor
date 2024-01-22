"use client";

import { useEffect, useMemo, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { TextInput, TextAreaInput, FileInput } from "@/components/Form";
import { Recipe } from "@/app/lib/models/recipes/types";
import { RecipeFormState } from "@/app/lib/models/recipes/formState";
import createDefaultSlug from "@/app/lib/models/recipes/createSlug";
import { IngredientsListInput } from "./Ingredients";
import { InstructionsListInput } from "./Instructions";
import Image from "next/image";
import { DateTimeInput } from "@/components/Form/DateTime";

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
  const [imagesToUpload, setImagesToUpload] = useState<FileList>();
  const [imagePreviewURL, setImagePreviewURL] = useState<string>();

  useEffect(() => {
    const fetchedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(fetchedTimezone);
  }, []);

  useEffect(() => {
    if (imagesToUpload) {
      const previewImage = imagesToUpload[0];
      if (previewImage) {
        const url = URL.createObjectURL(previewImage);
        setImagePreviewURL(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }
  }, [imagesToUpload]);
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
      <FileInput
        label="Image"
        name="image"
        id="recipe-form-image"
        errors={state.errors?.image}
        onChange={(e) => setImagesToUpload(e.target?.files || undefined)}
      />
      <div className="w-full">
        {imagePreviewURL ? (
          <Image
            src={imagePreviewURL}
            alt="Image to upload"
            className="w-full"
            width={850}
            height={475}
          />
        ) : (
          image && (
            <Image
              src={`/recipe/${slug}/uploads/${image}`}
              alt="Heading image"
              width={850}
              height={475}
            />
          )
        )}
      </div>
      <TextAreaInput
        label="Description"
        name="description"
        id="recipe-form-description"
        defaultValue={description}
        errors={state.errors?.description}
      />
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
