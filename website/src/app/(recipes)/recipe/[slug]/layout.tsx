import getRecipes from "recipes-collection/controller/data/readIndex";
import { ReactNode } from "react";

export default function RecipePageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

export async function generateStaticParams() {
  const { recipes } = await getRecipes();
  return recipes.map(({ slug }) => ({ slug }));
}
