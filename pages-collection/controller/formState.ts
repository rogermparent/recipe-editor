export interface PageFormErrors extends Record<string, string[] | undefined> {
  description?: string[];
  name?: string[];
  date?: string[];
  slug?: string[];
}

export type PageFormState = {
  errors?: PageFormErrors;
  message: string;
};
