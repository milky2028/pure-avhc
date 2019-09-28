import { QueryParams } from './QueryParams';

export default interface WorkerFns {
  fn:
    | 'getDocuments'
    | 'queryDocuments'
    | 'addDocument'
    | 'signOut'
    | 'signInWithEmail'
    | 'createAccountWithEmailAndPassword';
  collection:
    | 'submenu'
    | 'products'
    | 'mainMenu'
    | 'iconMenu'
    | 'images'
    | 'subscribers'
    | 'testResults'
    | 'auth';
  queries?: QueryParams[];
  payload?: {};
}
