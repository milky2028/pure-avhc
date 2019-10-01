import { QueryParams } from './QueryParams';
import OrderByParams from './OrderByParams';

export default interface WorkerFns {
  fn:
    | 'getDocuments'
    | 'queryDocuments'
    | 'addDocument'
    | 'signOut'
    | 'signInWithEmail'
    | 'createAccountWithEmailAndPassword'
    | 'signInWithProvider'
    | 'listenForAuthStateChanges';
  collection:
    | 'submenu'
    | 'products'
    | 'mainMenu'
    | 'iconMenu'
    | 'images'
    | 'subscribers'
    | 'testResults'
    | 'auth'
    | 'wholesaleCatalog';
  queries?: QueryParams[];
  limit?: number;
  orderBy?: OrderByParams;
  payload?: {};
}
