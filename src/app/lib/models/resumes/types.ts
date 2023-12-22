interface Education {
  slug: string;
  school: string;
  achievement: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  slug: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  duties: string[];
}

interface Project {
  slug: string;
  name: string;
  url: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Resume {
  date: number;
  job: string;
  company: string;
  skills: string[];
  name: string;
  phone: string;
  email: string;
  address: string;
  github: string;
  linkedin: string;
  website: string;
  education: Education[];
  jobExperience: Experience[];
  projects: Project[];
}

export type ResumeEntryKey = [date: number, slug: string];
export interface ResumeEntryValue {
  job: string;
  company: string;
}

export interface ResumeEntry {
  key: ResumeEntryKey;
  value: ResumeEntryValue;
  version?: number;
}
