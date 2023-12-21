export interface Resume {
  title: string;
  date: number;
  summary?: string;
  body?: string;
  image?: string;
}

export type ResumeEntryKey = [date: number, slug: string];
export interface ResumeEntryValue {
  title: string;
  summary?: string;
  image?: string;
}

export interface ResumeEntry {
  key: ResumeEntryKey;
  value: ResumeEntryValue;
  version?: number;
}
