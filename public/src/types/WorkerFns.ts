import { QueryParams } from './QueryParams';

export default interface WorkerFns {
  fn: 'getDocuments' | 'queryDocuments' | 'addDocument';
  collection:
    | 'logos'
    | 'submenu'
    | 'products'
    | 'mainMenu'
    | 'iconMenu'
    | 'images'
    | 'subscribers';
  queries?: QueryParams[];
  data?: any;
}
