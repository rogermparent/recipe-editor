import { SafeParseReturnType, z } from "zod";
import set from "lodash/set";

const DocsTreeFormSchema = z.object({
  items: z.array(z.object({ slug: z.string() })),
});

export type ParsedDocsTreeFormData = z.infer<typeof DocsTreeFormSchema>;

interface RawDocsTreeFormData {
  items: { slug: string }[];
}

export default function parseDocsTreeFormData(
  formData: FormData,
): SafeParseReturnType<RawDocsTreeFormData, ParsedDocsTreeFormData> {
  const data = {} as RawDocsTreeFormData;
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = DocsTreeFormSchema.safeParse(data);
  return validatedFields;
}
