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
    | 'listenForAuthStateChanges'
    | 'sendPasswordResetEmail';
  collection:
    | 'submenu'
    | 'products'
    | 'mainMenu'
    | 'iconMenu'
    | 'images'
    | 'subscribers'
    | 'testResults'
    | 'auth'
    | 'wholesaleCatalog'
    | 'addresses';
  queries?: QueryParams[];
  limit?: number;
  orderBy?: OrderByParams;
  payload?: {};
}
