import { MenuItem, SubmenuItem } from './MenuItem';
import Product from './Product';
import IconMenuItem from './IconMenuItem';
import Image from './AvImage';
import TestResult from './TestResult';
import WholesaleCatalog from './WholesaleCatalog';
import Strain from './Strain';

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
    | TestResult[]
    | WholesaleCatalog[]
    | Strain[];
  imageUrl: string;
  functionsUrl: string;
  isOverlayShowing: boolean;
  isNavbarExpanded: boolean;
  snackbarMsg: string;
  submenu: SubmenuItem[];
  isDisclaimerShowing: boolean;
  products: Product[];
  mainMenu: MenuItem[];
  iconMenu: IconMenuItem[];
  images: Image[];
  strains: Strain[];
  testResults: TestResult[];
  wholesaleCatalog: WholesaleCatalog[];
}
