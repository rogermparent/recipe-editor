import { SafeParseReturnType, z } from "zod";
import set from "lodash/set";

const localUTCDateSchema = z.union([
  z.enum([""]),
  z.string().transform((value, ctx) => {
    const epoch = Date.parse(`${value}Z`);
    if (Number.isNaN(epoch)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
      });
      return z.NEVER;
    }
    return epoch;
  }),
]);

const RecipeFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string(),
        quantity: z.string().optional(),
        unit: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
  instructions: z
    .array(
      z.union([
        z.object({
          name: z.string().optional(),
          text: z.string(),
        }),
        z.object({
          name: z.string(),
          instructions: z.array(
            z.object({
              name: z.string().optional(),
              text: z.string(),
            }),
          ),
        }),
      ]),
    )
    .optional(),
});

export type ParsedRecipeFormData = z.infer<typeof RecipeFormSchema>;

interface RawRecipeFormData {
  name: string;
  description: string;
  date: string;
  slug: string;
  image?: File;
  ingredients: { ingredient: string }[];
  instructions: { name: string; text: string }[];
}

export default function parseRecipeFormData(
  formData: FormData,
): SafeParseReturnType<RawRecipeFormData, ParsedRecipeFormData> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = RecipeFormSchema.safeParse(data);
  return validatedFields;
}
