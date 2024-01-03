export interface DocsTreeNode {
  target?: string;
  label?: string;
  children?: DocsTreeNode[];
}

export interface DocsTree {
  items: DocsTreeNode[];
}
