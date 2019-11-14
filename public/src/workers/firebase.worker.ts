import { expose } from 'comlink';
import QueryParams from '@/types/QueryParams';
import OrderByParams from '@/types/OrderByParams';
import AvUser from '@/types/PureUser';

export default class FirebaseWorker {
  private firebase = import('firebase/app');
  private fb = this.initializeApp();
  private db = this.intializeFirestore(this.fb);
  private auth = this.initializeAuth(this.fb);

  public log() {
    console.log('Worker?');
  }

  public async addDocument(
    collection: string,
    data: any,
    callback?: (id: string) => any
  ) {
    try {
      const db = await this.db;
      const { id } = await db.collection(collection).add({
        ...data,
        timestamp: (await this.firebase).firestore.FieldValue.serverTimestamp()
      });
      if (callback) {
        callback(id);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getDocumentById(
    collection: string,
    documentId: string,
    snapshotCallback?: (
      data: firebase.firestore.DocumentData | undefined
    ) => any
  ) {
    try {
      const db = await this.db;
      const doc = db.collection(collection).doc(documentId);
      if (snapshotCallback) {
        return doc.onSnapshot((snap) => {
          const data = snap.data();
          snapshotCallback(data);
        });
      } else {
        const res = await doc.get();
        return res.data();
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getDocuments(
    collection: string,
    snapshotCallback?: (data: {}[]) => any
  ) {
    try {
      const db = await this.db;
      const docs = db
        .collection(collection)
        .where('site', 'array-contains', process.env.VUE_APP_NAME);
      if (snapshotCallback) {
        return docs.onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));
          const dataWithTimestamps = this.processTimestamps(data);
          snapshotCallback(dataWithTimestamps);
        });
      } else {
        const querySnapshot = await docs.get();
        const data: { id: string; [key: string]: any }[] = [];
        querySnapshot.forEach((doc) =>
          data.push({ ...doc.data(), id: doc.id })
        );
        return data;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async queryDocuments(
    {
      collection,
      queries,
      limit,
      orderBy,
      dontQueryBySite
    }: {
      collection: string;
      queries?: QueryParams[];
      limit?: number;
      orderBy?: OrderByParams;
      dontQueryBySite?: boolean;
    },
    snapshotCallback?: (data: {}[]) => any
  ) {
    try {
      const db = await this.db;
      let results:
        | firebase.firestore.CollectionReference
        | firebase.firestore.Query = db.collection(collection);
      if (!dontQueryBySite) {
        results = results.where(
          'site',
          'array-contains',
          process.env.VUE_APP_NAME
        );
      }
      if (queries) {
        queries.forEach(
          ({ fieldPath, operator, compareValue }: QueryParams) => {
            results = results.where(fieldPath, operator, compareValue);
          }
        );
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
          const dataWithTimestamps = this.processTimestamps(data);
          snapshotCallback(dataWithTimestamps);
        });
      } else {
        const querySnapshot = await results.get();
        const data: { id: string; [key: string]: any }[] = [];
        querySnapshot.forEach((doc) =>
          data.push({ ...doc.data(), id: doc.id })
        );
        return data;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  public async signInWithEmail(email: string, password: string) {
    try {
      const auth = await this.auth;
      return auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      throw new Error(e);
    }
  }

  public async createAccountWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      const auth = await this.auth;
      return auth.createUserWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return this.signInWithEmail(email, password);
      } else {
        throw new Error(e);
      }
    }
  }

  public async signOut() {
    try {
      const auth = await this.auth;
      return auth.signOut();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async listenForAuthStateChanges(
    callback: (user: Partial<AvUser>) => any
  ) {
    try {
      const auth = await this.auth;
      auth.onAuthStateChanged(async (userDetails) => {
        if (userDetails) {
          const {
            email,
            phoneNumber,
            displayName,
            uid,
            photoURL
          } = userDetails;
          const claims = auth.currentUser
            ? (await auth.currentUser.getIdTokenResult()).claims
            : null;
          const isWholesaleUser = claims ? claims.isWholesaleUser : false;
          const isAdmin = claims ? claims.isAdmin : false;
          callback({
            email,
            phoneNumber,
            displayName,
            uid,
            photoURL,
            isWholesaleUser,
            isAdmin
          });
        }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  public async sendPasswordResetEmail(email: string) {
    try {
      const auth = await this.auth;
      return auth.sendPasswordResetEmail(email);
    } catch (e) {
      throw new Error(e);
    }
  }

  private async initializeAuth(firebase: Promise<firebase.app.App>) {
    try {
      const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');
      const app = await firebase;
      await AuthImport;
      return app.auth();
    } catch (e) {
      throw new Error(e);
    }
  }

  private async intializeFirestore(firebase: Promise<firebase.app.App>) {
    try {
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
    } catch (e) {
      throw new Error(e);
    }
  }

  private async initializeApp() {
    try {
      const fb = await this.firebase;
      const firebaseConfig = JSON.parse(process.env
        .VUE_APP_FIREBASE_CONFIG as string);
      return fb.initializeApp(firebaseConfig);
    } catch (e) {
      throw new Error(e);
    }
  }

  private processTimestamps(data: { [key: string]: any }[]) {
    return data.map((d) =>
      Object.fromEntries(
        Object.entries(d).map(([key, value]) => [
          key,
          value.toDate ? value.toDate() : value
        ])
      )
    );
  }
}

expose(FirebaseWorker);
