import rebuildRecipeIndex from "@/collections/recipes/controller/actions/rebuildIndex";
import { auth } from "@/auth";
import { Button } from "@/components/Button";
import { Exporters } from "./exporter";

export default async function SettingsPage() {
  auth();
  return (
    <main className="h-full w-full p-2 max-w-prose mx-auto grow">
      <h2 className="text-lg font-bold my-3">Database</h2>
      <div className="p-2">
        <form action={rebuildRecipeIndex}>
          <Button type="submit">Reload Database</Button>
        </form>
      </div>
      <h2 className="text-lg font-bold my-3">Export</h2>
      <Exporters />
    </main>
  );
}
