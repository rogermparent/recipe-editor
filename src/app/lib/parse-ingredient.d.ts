declare module "parse-ingredient" {
  /**
   * Ingredient properties.
   */
  interface Ingredient {
    /**
     * The primary quantity (the lower quantity in a range, if applicable)
     */
    quantity: number | null;
    /**
     * The secondary quantity (the upper quantity in a range, or `null` if not applicable)
     */
    quantity2: number | null;
    /**
     * The unit of measure identifier
     */
    unitOfMeasureID: string | null;
    /**
     * The unit of measure
     */
    unitOfMeasure: string | null;
    /**
     * The description
     */
    description: string;
    /**
     * Whether the "ingredient" is actually a group header, e.g. "For icing:"
     */
    isGroupHeader: boolean;
  }
  export function parseIngredient(input: string): Ingredient[];
}
