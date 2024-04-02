import getMenus, {
  MassagedMenuEntry,
} from "menus-collection/controller/data/readIndex";
import Link from "next/link";

function MenuListItem({ menu: { name, slug } }: { menu: MassagedMenuEntry }) {
  return (
    <Link
      href={`/menus/edit/${slug}`}
      className="my-2 py-1 px-2 rounded-lg bg-slate-700 block"
    >
      <h2>{name}</h2>
      <div className="italic text-gray-400">{slug}</div>
    </Link>
  );
}

export default async function Menus() {
  const { menus } = await getMenus();

  return (
    <main className="flex flex-col items-center w-full p-2 max-w-4xl mx-auto grow">
      <div className="m-2 text-left w-full grow">
        <h2 className="font-bold text-2xl">Menu Editor</h2>
        {menus && menus.length > 0 ? (
          <div>
            {menus.map((menu) => {
              return <MenuListItem key={menu.slug} menu={menu} />;
            })}
          </div>
        ) : (
          <p className="text-center my-4">There are no menus yet.</p>
        )}
      </div>
      <div>
        <Link href="/menus/new">New Menu</Link>
      </div>
    </main>
  );
}
