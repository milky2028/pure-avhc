import AppBase from '@/types/AppBase';
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

  public async getApplicationBase() {
    if (!this.db) {
      await this.initializeFirestore();
    }
    try {
      return this.db
        .collection('base')
        .doc(process.env.VUE_APP_NAME)
        .onSnapshot((doc) => {
          const appBase = doc.data() as AppBase;
          postMessage(appBase);
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
      console.error(e);
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
      console.error(e);
    }
  }
}

self.addEventListener('message', async (msg) => {
  const firebaseWorker = new FirebaseWorker();
  await firebaseWorker[msg.data.fn]();
});
