import { Recipe } from "../../controller/types";

import Markdown from "component-library/components/Markdown";
import { RecipeImage } from "../RecipeImage";
import { Ingredients, MultipliedServings, MultiplierInput } from "./Multiplier";
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
    ingredients,
  } = recipe;

  return (
    <MultiplierProvider>
      <div className="w-full h-full p-2 print:p-0 grow flex flex-col flex-nowrap">
        {/* Added flex container for lg screens */}
        <div className="container mx-auto lg:flex lg:flex-row">
          {image && (
            <RecipeImage
              slug={slug}
              image={image}
              alt="Heading image"
              width={580}
              height={450}
              sizes="100vw"
              className="object-cover aspect-ratio-[16/10] h-96 lg:max-w-96"
              loading="eager"
            />
          )}
          {/* Added width and padding for lg screens */}
          <div className="lg:w-1/2 lg:pl-4 flex-1">
            <h1 className="text-3xl font-bold mt-4 mb-6">{name}</h1>
            {description && (
              <div className="my-2">
                <Markdown>{description}</Markdown>
              </div>
            )}
            <div className="m-2 flex flex-row flex-wrap items-center justify-center">
              <MultiplierInput />
              <MultipliedServings recipe={recipe} />
              {prepTime && <InfoCard title="Prep Time">{prepTime}</InfoCard>}
              {cookTime && <InfoCard title="Cook Time">{cookTime}</InfoCard>}
              {totalTime && <InfoCard title="Total Time">{totalTime}</InfoCard>}
            </div>
          </div>
        </div>
        <div className="lg:flex lg:flex-row lg:px-2 flex-nowrap container mx-auto">
          <Ingredients ingredients={ingredients} />
          {instructions && (
            <div>
              <h2 className="text-xl font-bold my-3">Instructions</h2>
              <ol className="list-decimal pl-4">
                {instructions.map((entry, i) => (
                  <InstructionEntryView key={i} entry={entry} />
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </MultiplierProvider>
  );
};
