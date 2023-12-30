export interface DocPage {
  date: number;
  name: string;
  body: string;
}

export type DocPageEntryKey = [date: number, slug: string];
export interface DocPageEntryValue {
  name: string;
}

export interface DocPageEntry {
  key: DocPageEntryKey;
  value: DocPageEntryValue;
  version?: number;
}
