export interface MenuFormErrors extends Record<string, string[] | undefined> {
  name?: string[];
  slug?: string[];
}

export type MenuFormState = {
  errors?: MenuFormErrors;
  message: string;
};
