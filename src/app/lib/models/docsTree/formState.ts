export interface DocsTreeFormErrors
  extends Record<string, string[] | undefined> {}

export type DocsTreeFormState = {
  errors?: DocsTreeFormErrors;
  message: string;
};
