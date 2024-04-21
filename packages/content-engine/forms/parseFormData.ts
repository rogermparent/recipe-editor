import { SafeParseReturnType, ZodType } from "zod";
import set from "lodash/set";

export default function parseFormData<
  Output extends Record<string, unknown>,
  Input extends Record<string, unknown>,
>(formData: FormData, schema: ZodType): SafeParseReturnType<Input, Output> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = schema.safeParse(data);
  return validatedFields;
}
