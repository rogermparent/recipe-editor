import { SafeParseReturnType, z } from "zod";

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

const PostFormSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  body: z.string().optional(),
  image: z.instanceof(File).optional(),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
});

export type ParsedPostFormData = z.infer<typeof PostFormSchema>;

interface RawPostFormData {
  title: string;
  summary: string;
  body: string;
  image: File;
  date: string;
  slug: string;
}

export default function parsePostFormData(
  formData: FormData,
): SafeParseReturnType<RawPostFormData, ParsedPostFormData> {
  const validatedFields = PostFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    summary: formData.get("summary"),
    image: formData.get("image"),
    date: formData.get("date"),
    slug: formData.get("slug"),
  });
  return validatedFields;
}
