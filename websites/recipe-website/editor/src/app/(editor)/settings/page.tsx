import rebuildRecipeIndex from "recipes-collection/controller/actions/rebuildIndex";
import { auth, signIn } from "@/auth";
import { Button } from "component-library/components/Button";

export default async function SettingsPage() {
  const user = await auth();
  if (!user) {
    return signIn(undefined, {
      redirectTo: `/settings`,
    });
  }
  return (
    <main className="h-full w-full p-2 max-w-prose mx-auto grow">
      <h2 className="text-lg font-bold my-3">Database</h2>
      <div className="p-2">
        <form action={rebuildRecipeIndex}>
          <Button type="submit">Reload Database</Button>
        </form>
      </div>
    </main>
  );
}
