import { StaticImageProps } from ".";

export function RecipeImageDisplay({
  image: { props },
}: {
  image: StaticImageProps;
}) {
  return <img {...props} />;
}
