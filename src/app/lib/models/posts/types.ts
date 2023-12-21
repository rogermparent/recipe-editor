export interface Post {
  title: string;
  date: number;
  summary?: string;
  body?: string;
  image?: string;
}

export type PostEntryKey = [date: number, slug: string];
export interface PostEntryValue {
  title: string;
  summary?: string;
  image?: string;
}

export interface PostEntry {
  key: PostEntryKey;
  value: PostEntryValue;
  version?: number;
}
