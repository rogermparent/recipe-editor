import simpleGit from "simple-git";

export async function commitChanges(
  baseDirectory: string,
  recipeName: string,
  action: "create" | "update" | "delete",
) {
  const git = simpleGit(baseDirectory);

  await git.add("./*");
  let commitMessage;
  switch (action) {
    case "create":
      commitMessage = `Add new recipe: ${recipeName}`;
      break;
    case "update":
      commitMessage = `Update recipe: ${recipeName}`;
      break;
    case "delete":
      commitMessage = `Delete recipe: ${recipeName}`;
      break;
    default:
      throw new Error("Invalid action provided");
  }

  const result = await git.commit(commitMessage);

  console.log(result);
}
