"use client";

import React, { ChangeEvent, Reducer, useMemo, useReducer } from "react";

import Fraction from "fraction.js";

import { InstructionEntryView } from "../Instructions";
import { TextInput } from "component-library/components/Form/inputs/Text";
import { Ingredient, Recipe } from "../../../controller/types";
import { InfoCard } from "../shared";

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

export function MultiplyingView({ recipe }: { recipe: Recipe }) {
  const { servings, servingSize, ingredients, instructions } = recipe;

  const [{ fraction: multiplier }, setMultiplier] = useReducer(
    fractionInputReducer,
    {},
  );

  const multipliedServings =
    multiplier && servings
      ? multiplier.mul(servings).toFraction(true)
      : servings;

  return (
    <>
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
    </>
  );
}
