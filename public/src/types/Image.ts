export default interface Image {
  url: string;
  id: string;
  product: string;
  site: string[];
  alt: string;
  mainImage?: boolean;
  allProductsImage?: boolean;
  toolbarIamge?: boolean;
}
