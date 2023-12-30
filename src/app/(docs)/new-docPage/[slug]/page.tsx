import CreateForm from "../form";

export default async function NewDocPagePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <main className="flex flex-col items-center h-full w-full p-2 max-w-prose mx-auto grow bg-slate-950">
      <CreateForm slug={slug} />
    </main>
  );
}
