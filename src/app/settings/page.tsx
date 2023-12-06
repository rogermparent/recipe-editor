import { reloadPosts } from "@/app/lib/actions";
import { Button } from "@/components/Button";

export default async function SettingsPage() {
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow">
      <div className="p-2">
        <form action={reloadPosts}>
          <Button>Reload Database</Button>
        </form>
      </div>
    </main>
  );
}
