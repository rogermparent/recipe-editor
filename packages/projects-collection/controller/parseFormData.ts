import { SafeParseReturnType, z } from "zod";
import parseFormData from "content-engine/forms/parseFormData";

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

const ProjectFormSchema = z.object({
  name: z.string().min(1),
  content: z.string(),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
});

export type ParsedProjectFormData = z.infer<typeof ProjectFormSchema>;

interface RawProjectFormData {
  name: string;
  content: string;
  date: string;
  slug: string;
}

export default function parseProjectFormData(
  formData: FormData,
): SafeParseReturnType<RawProjectFormData, ParsedProjectFormData> {
  return parseFormData(formData, ProjectFormSchema);
}
