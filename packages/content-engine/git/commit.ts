import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import { join } from "path";
import { access } from "fs-extra";
import simpleGit from "simple-git";

export async function commitContentChanges(message: string) {
  const contentDirectory = getContentDirectory();
  try {
    await access(join(contentDirectory, ".git"));
  } catch {
    return undefined;
  }
  const git = simpleGit(contentDirectory);

  await git.add("./*");
  const result = await git.commit(message);

  console.log(result);
}
