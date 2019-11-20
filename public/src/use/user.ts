import { reactive, toRefs } from '@vue/composition-api';
import AvUser from '@/types/AvUser';
import initializeFirebaseApp from '@/functions/initializeFirebaseApp';
import FirebaseWorker from '@/workers/firebase.worker';
import { Remote } from 'comlink';
import WorkerEntry from '../workers/worker.entry';

export default function useUser() {
  async function initializeAuth(firebase: Promise<firebase.app.App>) {
    const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');
    const app = await firebase;
    await AuthImport;
    return app.auth();
  }

  const firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
  function _auth() {
    const app = initializeFirebaseApp(firebase);
    return initializeAuth(app);
  }

  const emptyUser = {
    isAdmin: false,
    isWholesaleUser: false,
    canSubscribe: true,
    uid: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    photoURL: '',
    cart: []
  } as AvUser;
  const user = reactive(emptyUser);

  function setUserData(newUserData: Partial<AvUser>) {
    if (typeof newUserData === 'object') {
      for (const [key, value] of Object.entries(newUserData)) {
        user[key] = value;
      }
    }
  }

  async function listenForAuthStateChanges() {
    const auth = await _auth();
    auth.onAuthStateChanged(async (userDetails) => {
      if (userDetails) {
        const { email, phoneNumber, displayName, uid, photoURL } = userDetails;
        const claims = auth.currentUser
          ? (await auth.currentUser.getIdTokenResult()).claims
          : null;
        const isWholesaleUser = claims ? claims.isWholesaleUser : false;
        const isAdmin = claims && claims.isAdmin ? claims.isAdmin : false;
        setUserData({
          email,
          phoneNumber,
          displayName,
          uid,
          photoURL,
          isAdmin,
          isWholesaleUser
        });

        // @ts-ignore
        const _i = await new WorkerEntry();
        const workerInstance = _i as Remote<FirebaseWorker>;
        const userExtras = (await workerInstance.getDocumentById(
          'userExtras',
          userDetails.uid
        )) as Partial<AvUser>;
        setUserData(userExtras);
      }
    });
  }

  async function createAccountWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      const auth = await _auth();
      return auth.createUserWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return signInWithEmail(email, password);
      } else {
        throw new Error(e);
      }
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = await _auth();
    return auth.signInWithEmailAndPassword(email, password);
  }

  // @ts-ignore
  async function signInWithProvider(provider: string) {
    const auth = await _auth();
    switch (provider) {
      case 'google': {
        const google = new (await firebase).auth.GoogleAuthProvider();
        return await auth.signInWithPopup(google);
      }
      case 'facebook': {
        const facebook = new (await firebase).auth.FacebookAuthProvider();
        return await auth.signInWithPopup(facebook);
      }
    }
  }

  async function sendPasswordResetEmail(email: string) {
    const auth = await _auth();
    return auth.sendPasswordResetEmail(email);
  }

  async function signOut() {
    const auth = await _auth();
    setUserData(emptyUser);
    return auth.signOut();
  }

  return {
    ...toRefs(user),
    signInWithEmail,
    listenForAuthStateChanges,
    sendPasswordResetEmail,
    signOut,
    initializeAuth,
    createAccountWithEmailAndPassword,
    signInWithProvider
  };
}