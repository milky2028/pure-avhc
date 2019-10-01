export default interface IconMenuItem {
  id: string;
  action: string;
  alt: string;
  icon: string;
  iconType: 'material' | 'external';
  linkType: 'internal' | 'external';
  sortOrder: number;
  site: string[];
}
