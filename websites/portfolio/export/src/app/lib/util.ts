import { mkdir } from "fs/promises";

export async function mkdirIfNeeded(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (e) {
    if ((e as { code: string }).code !== "EEXIST") {
      throw e;
    }
  }
}

export async function mkdirIfNotPresent(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (e) {
    if ((e as { code: string }).code === "EEXIST") {
      throw new Error("Project already exists");
    } else {
      throw e;
    }
  }
}
