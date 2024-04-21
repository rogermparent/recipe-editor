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
  const { items } = menu || {};
  return (
    <>
      <ItemsListInput
        label="Items"
        name="items"
        id="menu-form-items"
        defaultValue={items}
      />
    </>
  );
}
