import WorkerFns from '@/types/WorkerFns';
import { QueryParams } from '@/types/QueryParams';
const Firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const FirestoreImport = import(
  /* webpackChunkName: 'firestore' */ 'firebase/firestore'
);
// const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');

declare function postMessage(message: any, options?: PostMessageOptions): void;

class FirebaseWorker {
  [key: string]: any;
  private fb!: any;
  private db!: firebase.firestore.Firestore;
  private firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG!);
  private app!: firebase.app.App;

  constructor() {
    this.initializeApp();
  }

  public async addDocument({
    collection,
    data
  }: {
    collection: string;
    data: any;
  }) {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      const { id } = await this.db.collection(collection).add({
        ...data,
        timestamp: this.fb.firestore.FieldValue.serverTimestamp()
      });
      postMessage(id);
    } catch (e) {
      throw e;
    }
  }

  public async getDocuments({ collection }: { collection: string }) {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      return this.db
        .collection(collection)
        .where('site', 'array-contains', process.env.VUE_APP_NAME)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));
          const dataWithTimestamps = data.map((d: { [key: string]: any }) => {
            const entry: { [key: string]: any } = { ...d };
            for (const key in entry) {
              if (entry.hasOwnProperty(key)) {
                const value = entry[key];
                if (value.toDate) {
                  entry[key] = value.toDate();
                }
              }
            }
            return entry;
          });
          postMessage({ collection, data: dataWithTimestamps });
        });
    } catch (e) {
      throw e;
    }
  }

  public async queryDocuments({
    collection,
    queries
  }: {
    collection: string;
    queries: QueryParams[];
  }) {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      let results = this.db
        .collection(collection)
        .where('site', 'array-contains', process.env.VUE_APP_NAME);
      queries.forEach(({ fieldPath, operator, compareValue }: QueryParams) => {
        results = results.where(fieldPath, operator, compareValue);
      });
      return results.onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        const dataWithTimestamps = data.map((d: { [key: string]: any }) => {
          const entry: { [key: string]: any } = { ...d };
          for (const key in entry) {
            if (entry.hasOwnProperty(key)) {
              const value = entry[key];
              if (value.toDate) {
                entry[key] = value.toDate();
              }
            }
          }
          return entry;
        });
        postMessage({ collection, data: dataWithTimestamps });
      });
    } catch (e) {
      throw e;
    }
  }

  private async initializeApp() {
    try {
      this.fb = await Firebase;
      this.app =
        this.fb.apps.length < 1
          ? this.fb.initializeApp(this.firebaseConfig)
          : this.fb.app();
    } catch (e) {
      throw e;
    }
  }

  private async initializeFirestore() {
    try {
      await FirestoreImport;
      const db = this.app.firestore();
      if (!this.app.firestore) {
        db.enablePersistence().catch((e) => {
          if (e.code === 'failed-precondition') {
            throw e;
          } else if (e.code === 'unimplemented') {
            throw e;
          }
        });
      }
      this.db = db;
    } catch (e) {
      throw e;
    }
  }
}

self.addEventListener('message', (msg) => {
  const firebaseWorker = new FirebaseWorker();
  const { fn, collection, queries, data }: WorkerFns = msg.data;
  firebaseWorker[fn]({ collection, queries: queries!, data });
});
