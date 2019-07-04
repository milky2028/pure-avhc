import { MenuItem } from './MenuItem';

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
  [key: string]: Logo | boolean | MenuItem[];
  isOverlayShowing: boolean;
  appLogoMin: Logo;
  appLogoFull: Logo;
  submenu: MenuItem[];
}
