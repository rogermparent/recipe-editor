import { importRecipeData } from "@/collections/recipes/util/importRecipeData";
import CreateForm from "./form";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/Form/inputs/Text";

export default async function NewRecipe({
  searchParams: { import: importURL },
}: {
  searchParams: { import?: string };
}) {
  const importedRecipe = importURL
    ? await importRecipeData(importURL)
    : undefined;
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow bg-slate-950">
      <form>
        <TextInput name="import" label="Import from URL" />
        <Button type="submit">Import</Button>
      </form>
      <CreateForm recipe={importedRecipe} />
    </main>
  );
}
