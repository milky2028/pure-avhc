import { expose } from 'comlink';
import QueryParams from '@/types/QueryParams';
import OrderByParams from '@/types/OrderByParams';
import Collection from '@/types/Collection';
import initializeFirebaseApp from '../functions/initializeFirebaseApp';

const _firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const _fb = initializeFirebaseApp(_firebase);
const _db = intializeFirestore(_fb);

async function addDocument(
  collection: Collection,
  data: any,
  callback?: (id: string) => any
) {
  const db = await _db;
  const { id } = await db.collection(collection).add({
    ...data,
    timestamp: (await _firebase).firestore.FieldValue.serverTimestamp()
  });
  if (callback) {
    callback(id);
  }
}

async function getDocumentById(
  collection: Collection,
  documentId: string,
  snapshotCallback?: (data: firebase.firestore.DocumentData | undefined) => any
) {
  const db = await _db;
  const doc = db.collection(collection).doc(documentId);
  if (snapshotCallback) {
    return doc.onSnapshot((snap) => {
      const data = snap.data();
      snapshotCallback(data);
    });
  } else {
    const res = await doc.get();
    const data = res.data();
    if (data) {
      return processSingleTimestamp(data);
    } else {
      return;
    }
  }
}

async function getDocuments(
  collection: Collection,
  snapshotCallback?: (data: any[]) => any
) {
  const db = await _db;
  const docs = db
    .collection(collection)
    .where('site', 'array-contains', process.env.VUE_APP_NAME);
  if (snapshotCallback) {
    return docs.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      const dataWithTimestamps = processTimestamps(data);
      snapshotCallback(dataWithTimestamps);
    });
  } else {
    const querySnapshot = await docs.get();
    const data: { id: string; [key: string]: any }[] = [];
    querySnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
    return processTimestamps(data);
  }
}

async function queryDocuments(
  {
    collection,
    queries,
    limit,
    orderBy,
    dontQueryBySite
  }: {
    collection: Collection;
    queries?: QueryParams[];
    limit?: number;
    orderBy?: OrderByParams;
    dontQueryBySite?: boolean;
  },
  snapshotCallback?: (data: any[]) => any
) {
  const db = await _db;
  let results:
    | firebase.firestore.CollectionReference
    | firebase.firestore.Query = db.collection(collection);
  if (!dontQueryBySite) {
    results = results.where('site', 'array-contains', process.env.VUE_APP_NAME);
  }
  if (queries) {
    queries.forEach(({ fieldPath, operator, compareValue }: QueryParams) => {
      results = results.where(fieldPath, operator, compareValue);
    });
  }
  if (orderBy) {
    results = results.orderBy(orderBy.field, orderBy.direction);
  }
  if (limit) {
    results = results.limit(limit);
  }
  if (snapshotCallback) {
    return results.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      const dataWithTimestamps = processTimestamps(data);
      snapshotCallback(dataWithTimestamps);
    });
  } else {
    const querySnapshot = await results.get();
    const data: { id: string; [key: string]: any }[] = [];
    querySnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));
    return processTimestamps(data);
  }
}

async function intializeFirestore(firebase: Promise<firebase.app.App>) {
  const Firestore = import(
    /* webpackChunkName: 'firestore' */ 'firebase/firestore'
  );
  const app = await firebase;
  await Firestore;
  const db = app.firestore();
  db.enablePersistence().catch((e) => {
    if (e.code === 'failed-precondition') {
      throw new Error(e);
    } else if (e.code === 'unimplemented') {
      throw new Error(e);
    }
  });
  return db;
}

function processTimestamps(data: { [key: string]: any }[]) {
  return data.map((d) => processSingleTimestamp(d));
}

function processSingleTimestamp(data: { [key: string]: any }) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value.toDate ? value.toDate() : value
    ])
  );
}

export type IFirebaseWorker = typeof FirebaseWorker;
export const FirebaseWorker = {
  addDocument,
  queryDocuments,
  getDocumentById,
  getDocuments
};

expose(FirebaseWorker);
