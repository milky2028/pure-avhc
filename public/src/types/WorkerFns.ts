import { QueryParams } from './QueryParams';

export default interface WorkerFns {
  fn: 'getDocuments' | 'queryDocuments';
  collection: 'logos' | 'submenu' | 'products' | 'mainMenu' | 'iconMenu';
  queries?: QueryParams[];
}
