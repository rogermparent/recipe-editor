import rebuildRecipeIndex from "recipes-collection/controller/actions/rebuildIndex";
import { auth, signIn } from "@/auth";
import { Button } from "component-library/components/Button";
import simpleGit from "simple-git";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import clsx from "clsx";

async function checkout(branch: string) {
  "use server";
  await simpleGit(getContentDirectory()).checkout(branch);
  await rebuildRecipeIndex();
}

export default async function SettingsPage() {
  const contentGit = simpleGit(getContentDirectory());
  const branches = await contentGit.branchLocal();
  const currentBranch = branches.current;
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
      <h2 className="text-lg font-bold my-3">Content branches</h2>
      <div>
        {branches.all.map((branch) => {
          const checkoutThisBranch = checkout.bind(null, branch);
          return (
            <form key={branch} action={checkoutThisBranch}>
              <button
                type="submit"
                className={clsx(
                  "underline",
                  branch === currentBranch && "font-bold",
                )}
              >
                {branch}
              </button>
            </form>
          );
        })}
      </div>
    </main>
  );
}
