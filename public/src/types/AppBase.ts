import { MenuItem, SubmenuItem } from './MenuItem';

export interface Logo {
  url?: string;
  text?: string;
  type: '' | 'text' | 'image';
  alt?: string;
  site: 'avhc' | 'pure' | '';
  size: 'min' | 'full' | '';
  subtext?: string;
}

export default interface AppBase {
  [key: string]: Logo | boolean | SubmenuItem[] | string;
  imageUrl: string;
  isOverlayShowing: boolean;
  isNavbarExpanded: boolean;
  appLogoMin: Logo;
  appLogoFull: Logo;
  submenu: SubmenuItem[];
}
