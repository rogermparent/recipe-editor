"use client";

import { useMemo, useState } from "react";
import slugify from "@sindresorhus/slugify";
import { Menu } from "../../controller/types";
import { MenuFormState } from "../../controller/formState";
import createDefaultSlug from "../../controller/createSlug";
import { TextInput } from "component-library/components/Form/inputs/Text";
import { StaticImageProps } from "next-static-image/src";
import { ItemsListInput } from "./Items";

export default function MenuFields({
  menu,
  slug,
  state,
}: {
  menu?: Partial<Menu>;
  slug?: string;
  state: MenuFormState;
  defaultImage?: StaticImageProps;
}) {
  const { name, items } = menu || {};
  const [currentName, setCurrentName] = useState(name);
  const defaultSlug = useMemo(
    () => slugify(createDefaultSlug({ name: currentName || "" })),
    [currentName],
  );
  return (
    <>
      <TextInput
        label="Name"
        name="name"
        id="menu-form-name"
        defaultValue={name}
        onChange={(e) => setCurrentName(e.target.value)}
        errors={state.errors?.name}
      />
      <ItemsListInput
        label="Items"
        name="items"
        id="menu-form-items"
        defaultValue={items}
      />
      <details className="py-1 my-1" open>
        <summary className="text-sm font-semibold">Advanced</summary>
        <div className="flex flex-col flex-nowrap">
          <TextInput
            label="Slug"
            name="slug"
            id="menu-form-slug"
            defaultValue={slug}
            placeholder={defaultSlug}
            errors={state.errors?.slug}
          />
        </div>
      </details>
    </>
  );
}
