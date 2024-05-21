"use client";

import UpdateMenuFields from "menus-collection/components/Form/Update";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { Menu } from "menus-collection/controller/types";
import { MenuFormState } from "menus-collection/controller/formState";
import updateMenu from "menus-collection/controller/actions/update";
import Link from "next/link";

export default function EditMenuForm({
  menu,
  slug,
}: {
  slug: string;
  menu: Menu | undefined;
}) {
  const initialState = { message: "", errors: {} } as MenuFormState;
  const updateThisMenu = updateMenu.bind(null, slug);
  const [state, dispatch] = useFormState(updateThisMenu, initialState);
  return (
    <form
      id="menu-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <UpdateMenuFields menu={menu} slug={slug} state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
      <div>
        <Link href="/menus">Back to Menus</Link>
      </div>
    </form>
  );
}
