export interface MenuItem {
  display: string;
  icon?: MenuIcon;
  type: 'external' | 'internal';
  url: string;
}

export interface MenuIcon {
  type: 'material' | 'external';
  data: string;
}
