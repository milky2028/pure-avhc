export interface Logo {
  url: string;
  text: string;
  type: '' | 'text' | 'image';
  alt: string;
}

export default interface AppBase {
  [key: string]: Logo | boolean;
  isOverlayShowing: boolean;
  appLogoMin: Logo;
}
