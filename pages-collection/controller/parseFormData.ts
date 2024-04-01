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

const PageFormSchema = z.object({
  name: z.string().min(1),
  content: z.string(),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
});

export type ParsedPageFormData = z.infer<typeof PageFormSchema>;

interface RawPageFormData {
  name: string;
  content: string;
  date: string;
  slug: string;
}

export default function parsePageFormData(
  formData: FormData,
): SafeParseReturnType<RawPageFormData, ParsedPageFormData> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = PageFormSchema.safeParse(data);
  return validatedFields;
}
