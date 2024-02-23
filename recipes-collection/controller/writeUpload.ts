"use server";

import { getRecipeUploadsDirectory } from "./filesystemDirectories";
import { createWriteStream } from "fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ReadableStream } from "node:stream/web";
import { ParsedRecipeFormData } from "./parseFormData";
import { mkdirIfNeeded } from "../util/mkdirIfNeeded";
import { Recipe } from "./types";

export interface RecipeImageData {
  hasImage: boolean;
  imageName?: string | undefined;
  image?: File | undefined;
}

export async function getRecipeFileInfo(
  recipeFormData: ParsedRecipeFormData,
  currentRecipeData?: Recipe | undefined,
): Promise<RecipeImageData> {
  const { image, clearImage } = recipeFormData;

  if (!image || image.size === 0) {
    if (clearImage) {
      return { hasImage: false };
    }
    return { hasImage: false, imageName: currentRecipeData?.image };
  }

  return { hasImage: true, imageName: image.name, image };
}

export default async function writeRecipeFiles(
  recipeBaseDirectory: string,
  { hasImage, imageName, image }: RecipeImageData,
): Promise<void> {
  if (!hasImage) {
    return undefined;
  }

  await mkdirIfNeeded(getRecipeUploadsDirectory(recipeBaseDirectory));

  const imageWriteStream = createWriteStream(
    `${recipeBaseDirectory}/uploads/${imageName}`,
  );
  const readStream = Readable.fromWeb(
    (image as File).stream() as ReadableStream<any>,
  );
  await pipeline(readStream, imageWriteStream);
}
