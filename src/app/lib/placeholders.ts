import {
  getResumeDirectory,
  getResumeUploadsDirectory,
} from "@/app/lib/models/resumes/filesystemDirectories";
import { resolve } from "path";
import { getPlaiceholder } from "plaiceholder";
import { readFile } from "fs/promises";

export async function getPlaceholder(slug: string, image: string) {
  const uploadFilePath = resolve(
    getResumeUploadsDirectory(getResumeDirectory(slug)),
    image,
  );
  const { base64 } = await getPlaiceholder(await readFile(uploadFilePath));
  return base64;
}
