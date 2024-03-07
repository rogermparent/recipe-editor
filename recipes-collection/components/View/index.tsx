import { Recipe } from "../../controller/types";

import Markdown from "component-library/components/Markdown";
import { RecipeImage } from "../RecipeImage";
import { MultiplyingView } from "./Multiplier";
import { InfoCard } from "./shared";
import { InstructionEntryView } from "./Instructions";
import { MultiplierProvider } from "./Multiplier/Provider";

export const RecipeView = ({
  recipe,
  slug,
}: {
  recipe?: Recipe;
  slug: string;
}) => {
  if (!recipe) {
    throw new Error("Recipe data not found!");
  }

  const {
    name,
    prepTime,
    cookTime,
    totalTime,
    description,
    image,
    instructions,
  } = recipe;

  return (
    <MultiplierProvider>
      <div className="w-full h-full p-2 print:p-0 grow flex flex-col flex-nowrap max-w-prose">
        <h1 className="text-2xl font-bold m-2">{name}</h1>
        {image && (
          <RecipeImage
            slug={slug}
            image={image}
            alt="Heading image"
            width={580}
            height={450}
            sizes="100vw"
            className="object-cover aspect-ratio-[16/10] h-96"
            loading="eager"
          />
        )}
        {description && <Markdown>{description}</Markdown>}
        <div className="m-2 flex flex-row flex-wrap items-center justify-center">
          {prepTime && <InfoCard title="Prep Time">{prepTime}</InfoCard>}
          {cookTime && <InfoCard title="Cook Time">{cookTime}</InfoCard>}
          {totalTime && <InfoCard title="Total Time">{totalTime}</InfoCard>}
        </div>
        <MultiplyingView recipe={recipe} />
        {instructions && (
          <div>
            <h2 className="text-lg font-bold my-3">Instructions</h2>
            <ol className="list-decimal pl-4">
              {instructions.map((entry, i) => (
                <InstructionEntryView key={i} entry={entry} />
              ))}
            </ol>
          </div>
        )}
      </div>
    </MultiplierProvider>
  );
};
