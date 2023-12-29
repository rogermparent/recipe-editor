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

const ResumeFormSchema = z.object({
  company: z.string().min(1),
  job: z.string().min(1),
  date: z.optional(localUTCDateSchema),
  slug: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  education: z
    .array(
      z.object({
        school: z.string(),
        achievement: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .optional(),
  experience: z
    .array(
      z.object({
        company: z.string(),
        title: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        url: z.array(z.string()).optional(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .optional(),
});

export type ParsedResumeFormData = z.infer<typeof ResumeFormSchema>;

interface RawResumeFormData {
  company: string;
  job: string;
  date: string;
  slug: string;
}

export default function parseResumeFormData(
  formData: FormData,
): SafeParseReturnType<RawResumeFormData, ParsedResumeFormData> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = ResumeFormSchema.safeParse(data);
  return validatedFields;
}
