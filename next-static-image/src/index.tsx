import { ImageLoaderProps, ImageProps, getImageProps } from "next/image";
import { join, parse, posix } from "path";
import sharp, { Sharp } from "sharp";
import { access, mkdir } from "fs/promises";
import { ImgProps } from "next/dist/shared/lib/get-img-props";
import ora, { oraPromise } from "ora";

export interface StaticImageProps {
  props: ImgProps;
}

export interface TransformedRecipeImageProps {
  slug: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: ImageProps["loading"];
  sizes?: ImageProps["sizes"];
}

// Simple method of avoiding running two of the same resize operation at once.
const runningResizes = new Map();

async function resizeImage({
  sharp,
  width,
  quality,
  resultPath,
  resultFilename,
}: {
  sharp: Sharp;
  width: number;
  quality: number;
  resultPath: string;
  resultFilename: string;
}) {
  // Return early if this transform is currently running elsewhere
  if (runningResizes.has(resultPath)) {
    return;
  }

  // Claim our spot in cache for currently running transforms.
  runningResizes.set(resultPath, true);

  // Return early if the exact image we're creating exists on the filesystem
  try {
    await access(resultPath);
    return;
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
  runningResizes.delete(resultPath);
}

interface LocalTransformProps {
  srcPath: string;
  localOutputDirectory: string;
}

export async function getTransformedImageProps(
  { srcPath, localOutputDirectory }: LocalTransformProps,
  imagePropsArgs: ImageProps,
): Promise<StaticImageProps> {
  const promisedResizedImages: Promise<void>[] = [];
  const imageSharp = sharp(srcPath);

  function loader({ src, width, quality = 75 }: ImageLoaderProps) {
    const { name } = parse(src);
    const resultFilename = `${name}-w${width}q${quality}.webp`;
    const resultPath = join(localOutputDirectory, src, resultFilename);
    promisedResizedImages.push(
      resizeImage({
        sharp: imageSharp,
        width,
        quality,
        resultPath,
        resultFilename,
      }),
    );
    const resultSrc = posix.join(
      "/image",
      encodeURI(src),
      encodeURI(resultFilename),
    );
    return resultSrc;
  }

  const { props } = getImageProps({ loader, ...imagePropsArgs });

  await Promise.all(promisedResizedImages);
  return { props };
}
