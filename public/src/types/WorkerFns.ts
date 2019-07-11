import { QueryParams } from './QueryParams';

export default interface WorkerFns {
  fn: 'getDocuments' | 'queryDocuments';
  collection: 'logos' | 'submenu' | 'products' | 'main-menu';
  queries?: QueryParams[];
}
