export interface PostFormErrors {
  title?: string[];
  body?: string[];
  summary?: string[];
  image?: string[];
  date?: string[];
  slug?: string[];
}

export type PostFormState = {
  errors?: PostFormErrors;
  message: string;
};
