export type Ingredient = {
  ingredient: string;
  unit?: string;
  quantity?: string;
  note?: string;
};

export type Instruction = {
  name?: string;
  text: string;
};

export interface Recipe {
  name: string;
  date: number;
  description?: string;
  image?: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  servingSize?: string;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
}

export type RecipeEntryKey = [date: number, slug: string];
export interface RecipeEntryValue {
  name: string;
  description?: string;
  image?: string;
}

export interface RecipeEntry {
  key: RecipeEntryKey;
  value: RecipeEntryValue;
  version?: number;
}
