import { join } from "path";
import { getContentDirectory } from "../../controller/filesystemDirectories";
import {
  TransformedRecipeImageProps,
  getTransformedImageProps,
} from "next-static-image/src";
import { StaticImageDisplay } from "next-static-image/src/Display";

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

  return getTransformedImageProps(
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
    const image = await getTransformedRecipeImageProps(inputProps);
    return <StaticImageDisplay image={image} />;
  }
}
