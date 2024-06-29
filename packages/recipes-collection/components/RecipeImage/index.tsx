import { join } from "path";
import { getContentDirectory } from "content-engine/fs/getContentDirectory";
import {
  TransformedRecipeImageProps,
  getStaticImageProps,
} from "next-static-image/src";
import Image from "next/image";

const localOutputDirectory = join(getContentDirectory(), "transformed-images");

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

  try {
    const transformedProps = await getStaticImageProps(
      { srcPath, localOutputDirectory },
      {
        src: `/recipe/${slug}/uploads/${image}`,
        alt,
        width,
        height,
        className,
        loading,
        sizes,
      },
    );
    return transformedProps;
  } catch (e) {
    const { code, message } = e as { code?: string; message?: string };
    console.warn(
      `RecipeImage "${image}" failed with error` +
        (code ? `code ${code}` : "") +
        (message ? `: ${message}` : ""),
    );
  }
}

export async function RecipeImage(inputProps: TransformedRecipeImageProps) {
  if (inputProps.image) {
    const image = await getTransformedRecipeImageProps(inputProps);
    if (image) {
      return (
        <Image {...image.props} alt={inputProps.alt} unoptimized={true}>
          {null}
        </Image>
      );
    }
  }
}
