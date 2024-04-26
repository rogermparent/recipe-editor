import NewForm from "./form";

export default async function NewPage() {
  return (
    <main className="flex flex-col items-center px-2 grow max-w-prose w-full h-full">
      <h1 className="text-2xl font-bold my-2">New Page</h1>
      <NewForm />
    </main>
  );
}
