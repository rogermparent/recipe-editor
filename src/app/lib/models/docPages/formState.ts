export interface ResumeFormErrors extends Record<string, string[] | undefined> {
  company?: string[];
  job?: string[];
  date?: string[];
  slug?: string[];
}

export type ResumeFormState = {
  errors?: ResumeFormErrors;
  message: string;
};
