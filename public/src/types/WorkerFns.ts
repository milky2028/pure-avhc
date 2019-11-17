import QueryParams from './QueryParams';
import OrderByParams from './OrderByParams';
import Collection from './Collection';

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
  collection: Collection;
  queries?: QueryParams[];
  limit?: number;
  orderBy?: OrderByParams;
  dontQueryBySite?: boolean;
  payload?: {};
  targetModule?: string;
}
