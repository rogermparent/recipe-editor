import { fetchRecipeData } from "@/app/lib/getRecipeJson";
import CreateForm from "./form";
import { TextInput } from "@/components/Form";
import { Button } from "@/components/Button";

export default async function NewRecipe({
  searchParams: { import: importURL },
}: {
  searchParams: { import?: string };
}) {
  const importedRecipe = importURL
    ? await fetchRecipeData(importURL)
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
