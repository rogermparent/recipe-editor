"use client";

import React, {
  ChangeEvent,
  ReactNode,
  Reducer,
  useMemo,
  useReducer,
} from "react";
import { Ingredient, Recipe } from "@/collections/recipes/controller/types";

import Fraction from "fraction.js";
import clsx from "clsx";
import Image from "next/image";

import Markdown from "@/components/Markdown";
import { InstructionEntryView } from "./Instructions";
import { TextInput } from "@/components/Form/inputs/Text";

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("rounded-sm", className)}>{children}</div>;
}

export const IngredientView = ({
  ingredient,
  quantity,
  unit,
  multiplier,
  note,
}: {
  ingredient?: string;
  quantity?: string;
  unit?: string;
  note?: string;
  multiplier?: Fraction;
}) => {
  const parsedQuantity = useMemo(
    () => quantity && new Fraction(quantity),
    [quantity],
  );
  const multipliedQuantity =
    parsedQuantity && multiplier && !multiplier.equals(1)
      ? parsedQuantity.mul(multiplier)
      : parsedQuantity;
  return (
    <li>
      <div>
        <label>
          <input
            type="checkbox"
            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />{" "}
          {multipliedQuantity && (
            <span>{multipliedQuantity.toFraction(true)}</span>
          )}{" "}
          {unit && <span>{unit}</span>} <span>{ingredient}</span>
          {note && (
            <span>
              , <span>{note}</span>
            </span>
          )}
        </label>
      </div>
    </li>
  );
};

const fractionInputReducer: Reducer<
  { fraction?: Fraction; input?: string },
  string
> = (state, input) => {
  if (input === state.input) {
    return state;
  }
  if (!input || input === "1") {
    return { fraction: undefined, input };
  }
  try {
    const fraction = new Fraction(input);
    return { fraction, input };
  } catch (e) {
    return state;
  }
};

const InfoCard: React.FC<{
  title?: string;
  children: ReactNode;
  className?: string;
}> = ({ title, children }) => (
  <Card className="p-2 m-1 text-center">
    {title && <div className="font-semibold">{title}</div>}
    <div>{children}</div>
  </Card>
);

export const Ingredients = ({
  ingredients,
  multiplier,
}: {
  ingredients?: Ingredient[];
  multiplier?: Fraction;
}) => {
  return (
    <>
      {ingredients && (
        <div>
          <h2 className="text-lg font-bold my-3">Ingredients</h2>
          <ul>
            {ingredients.map(({ ingredient, note, quantity, unit }, i) => (
              <IngredientView
                key={i}
                ingredient={ingredient}
                note={note}
                quantity={quantity}
                unit={unit}
                multiplier={multiplier}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export const RecipeView = ({
  recipe,
  slug,
}: {
  recipe?: Recipe;
  slug: string;
}) => {
  const {
    name,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    totalTime,
    servings,
    servingSize,
    description,
    image,
    placeholderURL,
  } = recipe || {};

  const [{ fraction: multiplier }, setMultiplier] = useReducer(
    fractionInputReducer,
    {},
  );

  const multipliedServings =
    multiplier && servings
      ? multiplier.mul(servings).toFraction(true)
      : servings;

  return (
    <div className="w-full h-full p-2 print:p-0 grow flex flex-col flex-nowrap max-w-prose">
      <h1 className="text-2xl font-bold m-2">{name}</h1>
      {image && placeholderURL && (
        <Image
          src={`/recipe/${slug}/uploads/${image}`}
          placeholder="blur"
          alt="Heading image"
          width={800}
          height={450}
          blurDataURL={placeholderURL}
          className="object-cover aspect-ratio-[16/10] h-96"
        />
      )}
      {description && <Markdown>{description}</Markdown>}
      <div className="m-2 flex flex-row flex-wrap items-center justify-center">
        {prepTime && <InfoCard title="Prep Time">{prepTime}</InfoCard>}
        {cookTime && <InfoCard title="Cook Time">{cookTime}</InfoCard>}
        {totalTime && <InfoCard title="Total Time">{totalTime}</InfoCard>}
      </div>
      <div className="m-2 flex flex-row flex-wrap items-center justify-center">
        {multipliedServings && (
          <InfoCard title="Servings">
            <span>{multipliedServings}</span>{" "}
            {servingSize && <span>{servingSize}</span>}
          </InfoCard>
        )}

        <label htmlFor="multiplier" className="w-24">
          <InfoCard>
            <TextInput
              id="multiplier"
              name="multiplier"
              label="Multiply"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMultiplier(e.target.value);
              }}
            />
          </InfoCard>
        </label>
      </div>
      <div className="my-3 marker:text-sm">
        <Ingredients ingredients={ingredients} multiplier={multiplier} />
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
    </div>
  );
};
