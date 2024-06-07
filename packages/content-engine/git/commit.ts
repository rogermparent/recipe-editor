import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import simpleGit from "simple-git";

export async function commitChanges(
  action: "create" | "update" | "delete",
  slugOrName: string,
) {
  const git = simpleGit(getContentDirectory());

  await git.add("./*");
  let commitMessage;
  switch (action) {
    case "create":
      commitMessage = `Add new recipe: ${slugOrName}`;
      break;
    case "update":
      commitMessage = `Update recipe: ${slugOrName}`;
      break;
    case "delete":
      commitMessage = `Delete recipe: ${slugOrName}`;
      break;
    default:
      throw new Error("Invalid action provided");
  }

  const result = await git.commit(commitMessage);

  console.log(result);
}
