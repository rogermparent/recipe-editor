import { writeFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import { join } from "path";

export default async function writeContentFile<T = Record<string, unknown>>({
  baseDirectory,
  filename,
  data,
}: {
  baseDirectory: string;
  filename: string;
  data: T;
}) {
  await ensureDir(baseDirectory);
  await writeFile(join(baseDirectory, filename), JSON.stringify(data));
}
