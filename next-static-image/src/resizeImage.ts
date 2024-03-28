import { parse } from "path";
import type { Sharp } from "sharp";
import { mkdir, stat } from "fs/promises";
import { oraPromise } from "ora";

// Simple method of avoiding running two of the same resize operation at once.
const runningResizes = new Set();

function trackRunning(resultPath: string) {
  runningResizes.add(resultPath);
}

function trackFinished(resultPath: string) {
  runningResizes.delete(resultPath);
}

export async function queuePossibleImageResize({
  sharp,
  width,
  quality,
  resultPath,
  resultFilename,
  srcMtime,
}: {
  sharp: Sharp;
  width: number;
  quality: number;
  resultPath: string;
  resultFilename: string;
  srcMtime: Date;
}) {
  // Return early if this transform is currently running elsewhere
  if (runningResizes.has(resultPath)) {
    return;
  }

  // Claim our spot in cache for currently running transforms.
  trackRunning(resultPath);

  // Return early if the exact image we're creating exists on the filesystem and is newer than the source image
  try {
    const { mtime: outputMtime } = await stat(resultPath);
    if (srcMtime < outputMtime) {
      return;
    }
  } catch (e) {}

  // Attempt to create directory for result, keep going if it already exists
  const { dir } = parse(resultPath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (e) {}

  await oraPromise(
    sharp.resize({ width }).webp({ quality }).toFile(resultPath),
    `Resizing ${resultFilename}`,
  );

  // Release our spot in cache for currently running transforms.
  trackFinished(resultPath);
}
