export interface ResumeFormErrors {
  title?: string[];
  body?: string[];
  summary?: string[];
  image?: string[];
  date?: string[];
  slug?: string[];
}

export type ResumeFormState = {
  errors?: ResumeFormErrors;
  message: string;
};
