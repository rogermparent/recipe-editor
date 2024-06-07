import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import simpleGit from "simple-git";

export async function commitChanges(message: string) {
  const git = simpleGit(getContentDirectory());

  await git.add("./*");
  const result = await git.commit(message);

  console.log(result);
}
