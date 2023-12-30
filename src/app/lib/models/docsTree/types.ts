export interface DocsTreeCategoryNode {
  label: string;
  children: DocsTreeNode[];
}

export interface DocsTreeDocPageNode {
  slug: string;
  label?: string;
  children?: DocsTreeNode[];
}

export interface DocsTreeLinkNode {
  type: "link";
  href: string;
}

export type DocsTreeNode =
  | DocsTreeDocPageNode
  | DocsTreeLinkNode
  | DocsTreeCategoryNode;

export interface DocsTree {
  items: DocsTreeNode[];
}
