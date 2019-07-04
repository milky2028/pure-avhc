import WorkerFns from '@/types/WorkerFns';
import { QueryParams } from '@/types/QueryParams';
const Firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const FirestoreImport = import(/* webpackChunkName: 'firestore' */ 'firebase/firestore');
const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');

declare function postMessage(message: any, options?: PostMessageOptions): void;

class FirebaseWorker {
  [key: string]: any;
  private db!: firebase.firestore.Firestore;
  private firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG!);
  private app!: firebase.app.App;

  constructor() {
    this.initializeApp();
  }

  public async getDocuments(collection: string) {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      return this.db
        .collection(collection)
        .where('site', 'array-contains', process.env.VUE_APP_NAME)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          postMessage({ collection, data });
        });
    } catch (e) {
      throw e;
    }
  }

  public async queryDocuments(
    collection: string,
    { fieldPath, operator, compareValue }: QueryParams
  ) {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      return this.db
        .collection(collection)
        .where('site', 'array-contains', process.env.VUE_APP_NAME)
        .where(fieldPath, operator, compareValue)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          postMessage({ collection, data });
        });
    } catch (e) {
      throw e;
    }
  }

  private async initializeApp() {
    try {
      const fb = await Firebase;
      this.app =
        fb.apps.length < 1 ? fb.initializeApp(this.firebaseConfig) : fb.app();
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
  const options: WorkerFns = msg.data;
  firebaseWorker[options.fn](options.collection, options.query!);
});
