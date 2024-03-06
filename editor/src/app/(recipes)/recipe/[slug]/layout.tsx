import { ReactNode } from "react";
import { MultiplierProvider } from "recipes-collection/components/View/Multiplier/Provider";

export default function RecipeViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MultiplierProvider>{children}</MultiplierProvider>;
}
