import { Menu } from "../../controller/types";
import { MenuFormState } from "../../controller/formState";
import MenuFields from "./fields";

export default async function MenuForm({
  menu,
  slug,
  state,
}: {
  menu?: Partial<Menu>;
  slug?: string;
  state: MenuFormState;
}) {
  return <MenuFields menu={menu} slug={slug} state={state} />;
}
