import { ImageLoaderProps, ImageProps, getImageProps } from "next/image";
import { join, parse, posix } from "path";
import sharp, { Sharp } from "sharp";
import { getContentDirectory } from "../../controller/filesystemDirectories";
import { mkdirIfNeeded } from "../../util/mkdirIfNeeded";
import { RecipeImageDisplay } from "./Display";
import { access } from "fs/promises";
import { ImgProps } from "next/dist/shared/lib/get-img-props";

// Simple method of avoiding running two of the same resize operation at once.
const runningResizes = new Map();

async function resizeImage({
  sharp,
  width,
  quality,
  resultPath,
}: {
  sharp: Sharp;
  width: number;
  quality: number;
  resultPath: string;
}) {
  if (runningResizes.has(resultPath)) {
    return;
  }
  runningResizes.set(resultPath, true);
  try {
    await access(resultPath);
    return;
  } catch (e) {}
  const { dir } = parse(resultPath);
  await mkdirIfNeeded(dir);
  await sharp.resize({ width }).webp({ quality }).toFile(resultPath);
  runningResizes.delete(resultPath);
}

export interface StaticImageProps {
  props: ImgProps;
}

export async function getTransformedImageProps(
  srcPath: string,
  imagePropsArgs: ImageProps,
): Promise<StaticImageProps> {
  const promisedResizedImages: Promise<void>[] = [];
  const imageSharp = sharp(srcPath);

  function loader({ src, width, quality = 75 }: ImageLoaderProps) {
    const { name } = parse(src);
    const resultFilename = `${name}-w${width}q${quality}.webp`;
    const resultPath = join(
      getContentDirectory(),
      "transformed-images",
      src,
      resultFilename,
    );
    promisedResizedImages.push(
      resizeImage({ sharp: imageSharp, width, quality, resultPath }),
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

interface TransformedRecipeImageProps {
  slug: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: ImageProps["loading"];
  sizes?: ImageProps["sizes"];
}

export async function getTransformedRecipeImageProps({
  slug,
  image,
  alt,
  width,
  height,
  loading,
  sizes,
  className,
}: TransformedRecipeImageProps) {
  const srcPath = join(
    getContentDirectory(),
    "recipes",
    "data",
    slug,
    "uploads",
    image,
  );

  return getTransformedImageProps(srcPath, {
    src: `/recipe/${slug}/uploads/${image}`,
    alt,
    width,
    height,
    className,
    loading,
    sizes,
  });
}

export async function RecipeImage(inputProps: TransformedRecipeImageProps) {
  if (inputProps.image) {
    const image = await getTransformedRecipeImageProps(inputProps);
    return <RecipeImageDisplay image={image} />;
  }
}
