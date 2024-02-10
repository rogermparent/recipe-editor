import getRecipes from "@/collections/recipes/controller/data/readIndex";
import {
  getRecipeDirectory,
  getRecipeUploadsDirectory,
} from "@/collections/recipes/controller/filesystemDirectories";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";
import sharp, { ResizeOptions } from "sharp";

interface Params {
  slug: string;
  filename: string;
  size: string;
}

const sizes: Record<string, ResizeOptions> = {
  thumbnail: { width: 400, height: 400 },
  page: { width: 850 },
};

export async function GET(
  _request: NextRequest,
  {
    params: { slug, filename, size },
  }: { params: { slug: string; filename: string; size: keyof typeof sizes } },
) {
  try {
    const uploadFilePath = resolve(
      getRecipeUploadsDirectory(getRecipeDirectory(slug)),
      filename,
    );
    const resizeOptions = sizes[size];
    if (!resizeOptions) {
      throw new Error(`Size ${size} has no definition`);
    }
    const buffer = await sharp(uploadFilePath).resize(resizeOptions).toBuffer();
    return new NextResponse(buffer);
  } catch (e) {
    notFound();
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  const fileParams: Params[] = [];
  const { recipes } = await getRecipes();
  for (const recipe of recipes) {
    const { slug, image } = recipe;
    if (image) {
      for (const size of Object.keys(sizes)) {
        fileParams.push({ slug, filename: image, size });
      }
    }
  }
  return fileParams;
}
