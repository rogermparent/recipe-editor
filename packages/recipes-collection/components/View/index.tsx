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
      <div className="w-full h-full p-2 print:p-0 grow flex flex-col max-w-prose lg:flex-row lg:gap-8">
        <div className="lg:w-2/3">
          {/* Main content container */}
          <h1 className="text-3xl font-bold mt-4 mb-6">{name}</h1>
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
        </div>

        <div className="lg:w-1/3">
          {/* Sidebar container */}
          {/* Info cards */}
          <div className="flex flex-col space-y-2 mb-4">
            {prepTime && <InfoCard title="Prep Time">{prepTime}</InfoCard>}
            {cookTime && <InfoCard title="Cook Time">{cookTime}</InfoCard>}
            {totalTime && <InfoCard title="Total Time">{totalTime}</InfoCard>}
          </div>
          {/* Multiplying View */}
          <MultiplyingView recipe={recipe} />
          {/* Instructions (horizontal on desktop) */}
          {instructions && (
            <div>
              <h2 className="text-xl font-bold my-3">Instructions</h2>
              <ol className="lg:flex lg:flex-row lg:flex-wrap lg:gap-4 lg:list-none">
                {instructions.map((entry, i) => (
                  <li key={i} className="lg:flex-1">
                    {/* Adjust width as needed */}
                    <InstructionEntryView entry={entry} />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </MultiplierProvider>
  );
};
