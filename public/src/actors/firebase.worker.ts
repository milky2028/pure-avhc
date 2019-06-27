import * as Comlink from 'comlink';

class FirebaseWorker {
  private firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG!);
}

Comlink.expose(FirebaseWorker);
