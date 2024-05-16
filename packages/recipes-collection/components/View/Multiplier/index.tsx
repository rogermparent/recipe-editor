"use client";

import React, { ChangeEvent } from "react";

import { TextInput } from "component-library/components/Form/inputs/Text";
import { Ingredient, Recipe } from "../../../controller/types";
import { InfoCard } from "../shared";
import { useMultiplier } from "./Provider";
import StyledMarkdown from "component-library/components/Markdown";
import { Multiplyable } from "./Multiplyable";
import { PaddedButton } from "component-library/components/Button";

export const IngredientItem = ({ ingredient }: { ingredient?: string }) => {
  return (
    <li>
      <label className="h-12 block flex flex-row items-center text-lg">
        <input
          type="checkbox"
          className="h-4 w-4 m-2 inline-block shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />{" "}
        {ingredient && (
          <StyledMarkdown components={{ Multiplyable }}>
            {ingredient}
          </StyledMarkdown>
        )}
      </label>
    </li>
  );
};

export const Ingredients = ({
  ingredients,
}: {
  ingredients?: Ingredient[];
}) => {
  return (
    <form>
      {ingredients && (
        <div className="my-4">
          <h2 className="text-xl font-bold">
            Ingredients
            <PaddedButton className="ml-2 h-12 text-base" type="reset">
              Reset
            </PaddedButton>
          </h2>
          <ul>
            {ingredients.map(({ ingredient }, i) => (
              <IngredientItem key={i} ingredient={ingredient} />
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export function MultiplyingView({ recipe }: { recipe: Recipe }) {
  const { servings, servingSize, ingredients } = recipe;

  const [{ multiplier, input }, setMultiplier] = useMultiplier();

  const multipliedServings =
    multiplier && servings
      ? multiplier.mul(servings).toFraction(true)
      : servings;

  return (
    <>
      <label htmlFor="multiplier" className="w-24 mx-auto">
        <InfoCard>
          <TextInput
            id="multiplier"
            name="multiplier"
            label="Multiply"
            defaultValue={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMultiplier(e.target.value);
            }}
          />
        </InfoCard>
      </label>
      <div className="my-3 marker:text-sm">
        <Ingredients ingredients={ingredients} />
      </div>
      <div className="m-2 flex flex-row flex-wrap items-center justify-center">
        {multipliedServings && (
          <InfoCard title="Servings">
            <span>{multipliedServings}</span>{" "}
            {servingSize && <span>{servingSize}</span>}
          </InfoCard>
        )}
      </div>
    </>
  );
}
