import { writeFile } from "fs/promises";
import { ensureDir, rename } from "fs-extra";
import { join } from "path";

export default async function updateContentFile<T = Record<string, unknown>>({
  currentBaseDirectory,
  baseDirectory,
  filename,
  data,
}: {
  currentBaseDirectory: string;
  baseDirectory: string;
  filename: string;
  data: T;
}) {
  if (currentBaseDirectory !== baseDirectory) {
    await rename(currentBaseDirectory, baseDirectory);
  }
  await ensureDir(baseDirectory);
  await writeFile(join(baseDirectory, filename), JSON.stringify(data));
}
