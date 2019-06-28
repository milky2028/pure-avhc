interface Logo {
  url: string;
  text: string;
  type: '' | 'text' | 'image';
}

export default interface AppBase {
  toolbarLogo: Logo;
}
