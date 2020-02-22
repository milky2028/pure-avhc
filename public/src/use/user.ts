import { reactive, toRefs } from '@vue/composition-api';
import AvUser from '@/types/AvUser';
import initializeFirebaseApp from '@/functions/initializeFirebaseApp';
import workerInstance from '../workers/entry';
import setAllStateInObj from '@/functions/setState';
import { clear } from 'idb-keyval';
import initializeAuth from '@/functions/intializeFirebaseAuth';

export function useUser() {
  const firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
  function _auth() {
    const app = initializeFirebaseApp(firebase);
    return initializeAuth(app);
  }

  const emptyUser: AvUser = {
    keyCreated: new Date(),
    key: '',
    isAdmin: false,
    isWholesaleUser: false,
    canSubscribe: true,
    uid: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    photoURL: '',
    cart: []
  };
  const user = reactive({ ...emptyUser });

  async function listenForAuthStateChanges() {
    const auth = await _auth();
    auth.onAuthStateChanged(async (userDetails) => {
      if (userDetails) {
        const { email, phoneNumber, displayName, uid, photoURL } = userDetails;
        const claims = auth.currentUser
          ? (await auth.currentUser.getIdTokenResult()).claims
          : null;

        setAllStateInObj(user, {
          ...claims,
          email,
          phoneNumber,
          displayName,
          uid,
          photoURL
        });
      }
    });
  }

  async function getUserExtras(uid?: string) {
    if (uid) {
      const instance = await workerInstance;
      const userExtras = await instance.getDocumentById('userExtras', uid);
      if (userExtras) {
        setAllStateInObj(user, userExtras);
      }
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = await _auth();
    const instance = await workerInstance;
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    if (userCredential.user) {
      await instance.authWorker(userCredential.credential);
      return getUserExtras(userCredential.user.uid);
    }
  }

  async function createAccountWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      const auth = await _auth();
      const instance = await workerInstance;
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await instance.authWorker(userCredential.credential);
      if (userCredential.user) {
        await instance.authWorker(userCredential.credential);
        return getUserExtras(userCredential.user.uid);
      }
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return signInWithEmail(email, password);
      } else {
        throw new Error(e);
      }
    }
  }

  async function signInWithProvider(provider: string) {
    const auth = await _auth();
    const instance = await workerInstance;
    switch (provider) {
      case 'google': {
        const google = new (await firebase).auth.GoogleAuthProvider();
        const userCredential = await auth.signInWithPopup(google);
        await instance.authWorker(userCredential.credential);
        if (userCredential.user) {
          await instance.authWorker(userCredential.credential);
          return getUserExtras(userCredential.user.uid);
        }
        break;
      }
      case 'facebook': {
        const facebook = new (await firebase).auth.FacebookAuthProvider();
        const userCredential = await auth.signInWithPopup(facebook);
        await instance.authWorker(userCredential.credential);
        if (userCredential.user) {
          await instance.authWorker(userCredential.credential);
          return getUserExtras(userCredential.user.uid);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  async function sendPasswordResetEmail(email: string) {
    const auth = await _auth();
    return auth.sendPasswordResetEmail(email);
  }

  async function signOut() {
    const auth = await _auth();
    const instance = await workerInstance;
    setAllStateInObj(user, { ...emptyUser });
    await clear();
    auth.signOut();
    return instance.signOutWorker();
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
export type IUser = ReturnType<typeof useUser>;
