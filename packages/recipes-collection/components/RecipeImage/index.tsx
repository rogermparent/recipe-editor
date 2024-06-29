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

  return getStaticImageProps(
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
}

export async function RecipeImage(inputProps: TransformedRecipeImageProps) {
  if (inputProps.image) {
    try {
      const image = await getTransformedRecipeImageProps(inputProps);
      return (
        <Image {...image.props} alt={inputProps.alt} unoptimized={true}>
          {null}
        </Image>
      );
    } catch (e) {
      const { code, message } = e as { code?: string; message?: string };
      console.warn(
        `RecipeImage "${inputProps.image}" failed with error` +
          (code ? `code ${code}` : "") +
          (message ? `: ${message}` : ""),
      );
    }
  }
}
