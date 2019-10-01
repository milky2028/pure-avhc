import { QueryParams } from './QueryParams';

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
    | 'wholesale';
  queries?: QueryParams[];
  payload?: {};
}
