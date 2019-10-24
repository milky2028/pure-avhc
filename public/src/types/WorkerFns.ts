import { QueryParams } from './QueryParams';
import OrderByParams from './OrderByParams';

export default interface WorkerFns {
  fn:
    | 'getDocuments'
    | 'getDocumentById'
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
    | 'addresses'
    | 'userExtras';
  queries?: QueryParams[];
  limit?: number;
  orderBy?: OrderByParams;
  dontQueryBySite?: boolean;
  payload?: {};
  targetModule?: string;
}
