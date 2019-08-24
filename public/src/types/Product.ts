import { Site } from './Site';
import Size from './Size';

export default interface Product {
  dateCreated: firebase.firestore.Timestamp;
  id: string;
  featuredInMenu: boolean;
  featuredOnHome: boolean;
  name: string;
  site: Site[];
  size: Size[];
  sortOrder: number;
  subtag: string;
  tagline: string;
  url: string;
}