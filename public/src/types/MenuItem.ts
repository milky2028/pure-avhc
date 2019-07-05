import { Site } from './Site';

export interface MenuItem {
  display: string;
  type: 'external' | 'internal';
  url: string;
}

export interface SubmenuItem {
  alt: string;
  icon: string;
  iconType: 'external' | 'material';
  linkType: 'external' | 'internal';
  action: string;
  site: Site[];
  url: string;
}
