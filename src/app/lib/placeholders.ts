import {
  getPostDirectory,
  getPostUploadsDirectory,
} from "@/app/lib/models/posts/filesystemDirectories";
import { resolve } from "path";
import { getPlaiceholder } from "plaiceholder";
import { readFile } from "fs/promises";

export async function getPlaceholder(slug: string, image: string) {
  const uploadFilePath = resolve(
    getPostUploadsDirectory(getPostDirectory(slug)),
    image,
  );
  const { base64 } = await getPlaiceholder(await readFile(uploadFilePath));
  return base64;
}
