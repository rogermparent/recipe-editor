import { Recipe } from "../../controller/types";
import { RecipeFormState } from "../../controller/formState";
import { StaticImageProps } from "next-static-image/src";
import RecipeFields from "./fields";

export default async function RecipeForm({
  recipe,
  slug,
  state,
  defaultImage,
}: {
  recipe?: Partial<Recipe>;
  slug?: string;
  state: RecipeFormState;
  defaultImage?: StaticImageProps;
}) {
  return (
    <RecipeFields
      defaultImage={defaultImage}
      recipe={recipe}
      slug={slug}
      state={state}
    />
  );
}
