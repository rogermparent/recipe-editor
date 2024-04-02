"use client";

import CreateMenuFields from "menus-collection/components/Form/Create";
import { useFormState } from "react-dom";
import { Button } from "component-library/components/Button";
import { MenuFormState } from "menus-collection/controller/formState";
import createMenu from "menus-collection/controller/actions/create";
import Link from "next/link";

export default function NewMenuForm() {
  const initialState = { message: "", errors: {} } as MenuFormState;
  const [state, dispatch] = useFormState(createMenu, initialState);
  return (
    <form
      id="menu-form"
      className="w-full h-full flex flex-col grow"
      action={dispatch}
    >
      <CreateMenuFields state={state} />
      <div className="flex flex-row flex-nowrap my-1">
        <Button type="submit">Submit</Button>
      </div>
      <div>
        <Link href="/menus">Back to Menus</Link>
      </div>
    </form>
  );
}
