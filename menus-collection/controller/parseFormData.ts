import { SafeParseReturnType, z } from "zod";
import parseFormData from "content-engine/forms/parseFormData";

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
  slug: string;
  items: RawMenuItemFormData;
}

const MenuSchema = z.object({
  items: z.optional(z.array(MenuItemSchema)),
});

export type ParsedMenuFormData = z.infer<typeof MenuSchema>;

export default function parseMenuFormData(
  formData: FormData,
): SafeParseReturnType<RawMenuFormData, ParsedMenuFormData> {
  return parseFormData(formData, MenuSchema);
}
