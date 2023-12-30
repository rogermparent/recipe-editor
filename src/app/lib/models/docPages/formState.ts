export interface DocPageFormErrors
  extends Record<string, string[] | undefined> {
  body?: string[];
  name?: string[];
  date?: string[];
  slug?: string[];
}

export type DocPageFormState = {
  errors?: DocPageFormErrors;
  message: string;
};
