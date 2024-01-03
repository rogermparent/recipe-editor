import { SafeParseReturnType, z } from "zod";
import set from "lodash/set";

const BaseTreeNodeSchema = z.object({
  target: z.string().optional(),
  label: z.string().optional(),
});

type TreeFormNode = z.infer<typeof BaseTreeNodeSchema> & {
  children?: TreeFormNode[];
};

const TreeNodeSchema: z.ZodType<TreeFormNode> = BaseTreeNodeSchema.extend({
  children: z.lazy(() => TreeNodeSchema.array()).optional(),
}).superRefine(({ target, label }, ctx) => {
  if (!(target || label)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Target or label must be present",
    });
  }
});

const DocsTreeFormSchema = z.object({
  items: z.array(TreeNodeSchema),
});

export type ParsedDocsTreeFormData = z.infer<typeof DocsTreeFormSchema>;

interface RawDocsTreeNodeFormData {
  target: string;
  label: string;
  children?: RawDocsTreeNodeFormData[];
}

interface RawDocsTreeFormData {
  items: RawDocsTreeNodeFormData[];
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
