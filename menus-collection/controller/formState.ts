export interface MenuFormErrors extends Record<string, string[] | undefined> {
  slug?: string[];
}

export type MenuFormState = {
  errors?: MenuFormErrors;
  message: string;
};
