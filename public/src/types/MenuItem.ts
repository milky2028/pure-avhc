import { Site } from './Site';

export interface MenuItem {
  id: string;
  sortOrder: number;
  site: Site[];
  display: string;
  type: 'external' | 'internal';
  url: string;
}

export interface SubmenuItem extends MenuItem {
  alt: string;
  icon: string;
  iconType: 'external' | 'material';
  linkType: 'external' | 'internal';
  action: string;
  url: string;
}

export interface IconMenuItem extends MenuItem {
  action: string;
  alt: string;
  icon: string;
  iconType: 'material' | 'external';
  linkType: 'internal' | 'external';
}
