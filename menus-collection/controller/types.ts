export interface MenuItem {
  name: string;
  href: string;
  children?: MenuItem[];
}

export interface Menu {
  name: string;
  items?: MenuItem[];
}
