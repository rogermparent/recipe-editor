import { readJson } from "fs-extra";
import { homepageContentFilePath } from "./paths";
import { HomepageContent } from "./types";

export async function getHomepageContent(): Promise<
  HomepageContent | undefined
> {
  try {
    const homepageContent = await readJson(homepageContentFilePath);
    return homepageContent;
  } catch {
    return undefined;
  }
}
