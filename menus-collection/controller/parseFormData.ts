import { SafeParseReturnType, z } from "zod";
import set from "lodash/set";

const baseMenuItemSchema = z.object({
  name: z.string(),
  href: z.string(),
});

type MenuItem = z.infer<typeof baseMenuItemSchema> & {
  children?: MenuItem[];
};

const MenuItemSchema: z.ZodType<MenuItem> = baseMenuItemSchema.extend({
  children: z.lazy(() => z.optional(MenuItemSchema.array())),
});

interface RawMenuItemFormData {
  name: string;
  href: string;
}

interface RawMenuFormData {
  name: string;
  slug: string;
  items: RawMenuItemFormData;
}

const MenuSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  items: z.optional(z.array(MenuItemSchema)),
});

export type ParsedMenuFormData = z.infer<typeof MenuSchema>;

export default function parseMenuFormData(
  formData: FormData,
): SafeParseReturnType<RawMenuFormData, ParsedMenuFormData> {
  const data = {};
  for (const [key, value] of formData.entries()) {
    set(data, key, value);
  }
  const validatedFields = MenuSchema.safeParse(data);
  return validatedFields;
}
