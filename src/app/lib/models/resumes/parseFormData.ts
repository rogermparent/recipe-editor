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
  skills: z.array(z.string().min(1)),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  github: z.string(),
  linkedin: z.string(),
  website: z.string(),
  education: z.array(
    z.object({
      school: z.string(),
      achievement: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      description: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      url: z.array(z.string()).optional(),
      description: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
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
