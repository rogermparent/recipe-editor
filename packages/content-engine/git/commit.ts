import simpleGit from "simple-git";

export async function commitChanges(baseDirectory: string, recipeName: string) {
  const git = simpleGit(baseDirectory);

  await git.add("./*");
  const result = await git.commit(`Add new recipe: ${recipeName}`);

  console.log(result);
}
