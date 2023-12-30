export type DocTreeNode =
  | DocTreeDocPageNode
  | DocTreeLinkNode
  | DocTreeCategoryNode;

export interface DocTreeCategoryNode {
  label: string;
  children: DocTreeNode[];
}

export interface DocTreeDocPageNode {
  slug: string;
  label?: string;
  children?: DocTreeNode[];
}

export interface DocTreeLinkNode {
  type: "link";
  href: string;
}

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
