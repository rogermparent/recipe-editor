import  rebuildPostIndex  from "@/app/lib/models/posts/actions/rebuildIndex";
import { auth } from "@/auth";
import { Button } from "@/components/Button";

export default async function SettingsPage() {
  auth();
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow">
      <div className="p-2">
        <form action={rebuildPostIndex}>
          <Button>Reload Database</Button>
        </form>
      </div>
    </main>
  );
}
