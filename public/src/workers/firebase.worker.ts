import WorkerFns from '@/types/WorkerFns';
import { QueryParams } from '@/types/QueryParams';
const Firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const FirestoreImport = import(
  /* webpackChunkName: 'firestore' */ 'firebase/firestore'
);
const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');

declare function postMessage(message: any, options?: PostMessageOptions): void;

interface EmailPayload {
  payload: { email: string; password: string };
  collection: string;
}

class FirebaseWorker {
  [key: string]: any;
  private fb!: any;
  private db!: firebase.firestore.Firestore;
  private auth!: firebase.auth.Auth;
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
      throw new Error(e);
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
      throw new Error(e);
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
      throw new Error(e);
    }
  }

  public async signOut({ collection }: { collection: string }) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }
      this.listenForAuthChanges(collection);
      this.auth.signOut();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async signInWithEmail({
    payload: { email, password },
    collection
  }: EmailPayload) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }
      this.listenForAuthChanges(collection);
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      postMessage({ collection, data: e });
      throw new Error(e);
    }
  }

  public async createAccountWithEmailAndPassword({
    payload: { email, password },
    collection
  }: EmailPayload) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }
      this.listenForAuthChanges(collection);
      await this.auth.createUserWithEmailAndPassword(email, password);
    } catch (e) {
      postMessage({ collection, data: e });
      throw new Error(e);
    }
  }

  public async signInWithProvider({
    payload: { provider, collection }
  }: {
    payload: { provider: string; collection: string };
  }) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }
      switch (provider) {
        case 'google': {
          const google = new this.fb.auth.GoogleAuthProvider();
          const userCredentials = await this.auth.signInWithPopup(google);
          postMessage({ userCredentials, provider, collection });
          break;
        }
        case 'facebook': {
          const facebook = new this.fb.auth.FacebookAuthProvider();
          const userCredentials = this.auth.signInWithPopup(facebook);
          postMessage({ userCredentials, provider, collection });
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  private async listenForAuthChanges(collection: string) {
    try {
      if (!this.auth) {
        await this.initializeAuth();
      }
      this.auth.onAuthStateChanged((userDetails) => {
        if (userDetails) {
          postMessage({ collection, data: userDetails.uid });
        }
      });
    } catch (e) {
      throw new Error(e);
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
      throw new Error(e);
    }
  }

  private async initializeFirestore() {
    try {
      await FirestoreImport;
      const db = this.app.firestore();
      if (!this.app.firestore) {
        db.enablePersistence().catch((e) => {
          if (e.code === 'failed-precondition') {
            throw new Error(e);
          } else if (e.code === 'unimplemented') {
            throw new Error(e);
          }
        });
      }
      this.db = db;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async initializeAuth() {
    try {
      await AuthImport;
      this.auth = this.app.auth();
    } catch (e) {
      throw new Error(e);
    }
  }
}

self.addEventListener('message', (msg) => {
  const firebaseWorker = new FirebaseWorker();
  const { fn }: WorkerFns = msg.data;
  firebaseWorker[fn](msg.data);
});
