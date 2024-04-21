import { auth } from "@/auth";
import { Exporters } from "./exporter";

export default async function SettingsPage() {
  auth();
  return (
    <main className="h-full w-full p-2 max-w-prose mx-auto grow">
      <h2 className="font-bold text-2xl">Export</h2>
      <Exporters />
    </main>
  );
}
