"use server";

import { getRecipeUploadsDirectory } from "./filesystemDirectories";
import { createWriteStream } from "fs";
import { basename } from "path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ReadableStream } from "node:stream/web";
import { ParsedRecipeFormData } from "./parseFormData";
import { mkdirIfNeeded } from "../util/mkdirIfNeeded";
import { Recipe } from "./types";

export interface RecipeImageData {
  imageName?: string | undefined;
  image?: File | undefined;
  imageImportUrl?: string | undefined;
}

export async function getRecipeFileInfo(
  recipeFormData: ParsedRecipeFormData,
  currentRecipeData?: Recipe | undefined,
): Promise<RecipeImageData> {
  const { image, clearImage, imageImportUrl } = recipeFormData;

  if (!image || image.size === 0) {
    if (clearImage) {
      return {};
    }
    if (imageImportUrl) {
      return {
        imageName: basename(imageImportUrl),
        imageImportUrl,
      };
    }
    return { imageName: currentRecipeData?.image };
  }

  return { imageName: image.name, image };
}

export default async function writeRecipeFiles(
  recipeBaseDirectory: string,
  { imageName, image, imageImportUrl }: RecipeImageData,
): Promise<void> {
  if (!image && !imageImportUrl) {
    return undefined;
  }

  await mkdirIfNeeded(getRecipeUploadsDirectory(recipeBaseDirectory));

  const imageWriteStream = createWriteStream(
    `${recipeBaseDirectory}/uploads/${imageName}`,
  );
  if (image) {
    const readStream = Readable.fromWeb(
      (image as File).stream() as ReadableStream<any>,
    );
    await pipeline(readStream, imageWriteStream);
  } else if (imageImportUrl) {
    const importedImageData = await fetch(imageImportUrl);
    if (importedImageData.body) {
      await pipeline(
        Readable.fromWeb(importedImageData.body as ReadableStream<any>),
        imageWriteStream,
      );
    }
  }
}
