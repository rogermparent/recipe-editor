import { ImageLoaderProps, getImageProps } from "next/image";
import { RecipeImageDisplay } from "../Display";
import { parse } from "path";

export function pureLoader({ src, width, quality = 75 }: ImageLoaderProps) {
  const { name } = parse(src);
  const resultFilename = `${name}-w${width}q${quality}.webp`;
  const resultSrc = encodeURI(`/image${src}/${resultFilename}`);
  return resultSrc;
}

interface PureRecipeImageProps {
  slug: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function getPureRecipeImageProps({
  slug,
  image,
  alt,
  width,
  height,
  className,
}: PureRecipeImageProps) {
  const { props } = getImageProps({
    loader: pureLoader,
    src: `/recipe/${slug}/uploads/${image}`,
    alt,
    width,
    height,
    className,
  });

  return { props };
}

export function PureRecipeImage(inputProps: PureRecipeImageProps) {
  if (inputProps.image) {
    const image = getPureRecipeImageProps(inputProps);
    return <RecipeImageDisplay image={image} />;
  }
}
