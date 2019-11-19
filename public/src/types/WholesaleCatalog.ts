import { Site } from './Site';

export default interface WholesaleCatalog {
  id: string;
  site: Site[];
  date: Date;
  url: string;
}
