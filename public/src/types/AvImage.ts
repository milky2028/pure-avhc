import { Site } from './Site';

export default interface AvImage {
  [key: string]: string | Site[] | boolean | undefined;
  url: string;
  id: string;
  product: string;
  site: Site[];
  alt: string;
  mainImage?: boolean;
  allProductsImage?: boolean;
  toolbarImage?: boolean;
}
