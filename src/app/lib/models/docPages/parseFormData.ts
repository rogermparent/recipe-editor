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

const DocPageFormSchema = z.object({
  name: z.string().min(1),
  body: z.string(),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
});

export type ParsedDocPageFormData = z.infer<typeof DocPageFormSchema>;

interface RawDocPageFormData {
  name: string;
  body: string;
  date: string;
  slug: string;
}

export default function parseDocPageFormData(
  formData: FormData,
): SafeParseReturnType<RawDocPageFormData, ParsedDocPageFormData> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = DocPageFormSchema.safeParse(data);
  return validatedFields;
}
