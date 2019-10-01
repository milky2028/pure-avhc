import { MenuItem, SubmenuItem } from './MenuItem';
import Product from './Product';
import IconMenuItem from './IconMenuItem';
import Image from './Image';
import TestResult from './TestResult';

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
  [key: string]:
    | boolean
    | SubmenuItem[]
    | string
    | MenuItem[]
    | Product[]
    | IconMenuItem[]
    | Image[]
    | TestResult[];
  imageUrl: string;
  isOverlayShowing: boolean;
  isNavbarExpanded: boolean;
  submenu: SubmenuItem[];
  isDisclaimerShowing: boolean;
  products: Product[];
  mainMenu: MenuItem[];
  iconMenu: IconMenuItem[];
  images: Image[];
  testResults: TestResult[];
  wholesaleCatalog: '';
}
