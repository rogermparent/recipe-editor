export interface PageFormErrors extends Record<string, string[] | undefined> {
  name?: string[];
  date?: string[];
  slug?: string[];
}

export type PageFormState = {
  errors?: PageFormErrors;
  message: string;
};
