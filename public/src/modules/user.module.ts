// @ts-ignore
import Worker from 'worker-loader!../workers/firebase.worker';
import setState, { setAllStateInObj } from '@/functions/setState';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import router from '@/router';
import PureUser from '@/types/PureUser';
const Firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');

interface Context {
  commit: Commit;
  state: PureUser;
}

const UserModule = {
  namespaced: true,
  state: {
    isAdmin: false,
    isWholesaleUser: false,
    uid: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    photoURL: ''
  },
  mutations: {
    setState,
    setAllStateInObj
  },
  actions: {
    loginWithEmail(
      { commit }: Context,
      payload: { email: string; password: string }
    ) {
      const worker = new Worker();
      const workerMsg: WorkerFns = {
        fn: 'signInWithEmail',
        collection: 'auth',
        payload
      };

      worker.postMessage(workerMsg);
      return new Promise((resolve, reject) => {
        worker.addEventListener('message', ({ data }: MessageEvent) => {
          if (data.collection === 'auth') {
            if (data.data.code) {
              reject(data.data.message);
            } else {
              const userDetails = data.data;
              commit('setAllStateInObj', userDetails);
              resolve();
            }
          }
        });
      });
    },
    // @ts-ignore
    sendPasswordResetEmail({ commit }: Context, email: string) {
      const worker = new Worker();
      const workerMsg: WorkerFns = {
        fn: 'sendPasswordResetEmail',
        collection: 'auth',
        payload: { email }
      };

      worker.postMessage(workerMsg);
      return new Promise((resolve, reject) => {
        worker.addEventListener('message', ({ data }: MessageEvent) => {
          if (data.data.code) {
            reject(data.data.message);
          } else {
            resolve();
          }
        });
      });
    },
    signOut({ commit }: Context) {
      const worker = new Worker();
      const workerMsg: WorkerFns = { fn: 'signOut', collection: 'auth' };

      worker.postMessage(workerMsg);
      const emptyUser = {
        isWholesaleUser: false,
        isAdmin: false,
        uid: '',
        email: '',
        displayName: '',
        phoneNumber: '',
        photoURL: ''
      };
      commit('setAllStateInObj', emptyUser);
      router.push('/');
    },
    listenForAuthStateChanges({ commit }: Context) {
      const worker = new Worker();
      const workerMsg: WorkerFns = {
        fn: 'listenForAuthStateChanges',
        collection: 'auth'
      };
      worker.postMessage(workerMsg);

      return new Promise((resolve, reject) => {
        worker.addEventListener('message', ({ data }: MessageEvent) => {
          if (data.collection === 'auth') {
            if (data.data.code) {
              reject(data.data.message);
            } else {
              const userDetails = data.data;
              commit('setAllStateInObj', userDetails);
              resolve();
            }
          }
        });
      });
    },
    createAccountWithEmailAndPassword(
      { commit }: Context,
      payload: { email: string; password: string }
    ) {
      const worker = new Worker();
      const workerMsg: WorkerFns = {
        fn: 'createAccountWithEmailAndPassword',
        collection: 'auth',
        payload
      };
      worker.postMessage(workerMsg);

      return new Promise((resolve, reject) => {
        worker.addEventListener('message', ({ data }: MessageEvent) => {
          if (data.collection === 'auth') {
            if (data.data.code) {
              reject(data.data.message);
            } else {
              const userDetails = data.data;
              commit('setAllStateInObj', userDetails);
              resolve();
            }
          }
        });
      });
    },
    async signInWithProvider({ commit }: Context, provider: string) {
      try {
        const fb = await Firebase;
        const firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG!);
        const app =
          fb.apps.length < 1 ? fb.initializeApp(firebaseConfig) : fb.app();
        await AuthImport;
        const auth = app.auth();
        switch (provider) {
          case 'google': {
            const google = new fb.auth.GoogleAuthProvider();
            const userCredentials = await auth.signInWithPopup(google);
            if (userCredentials && userCredentials.user) {
              const {
                email,
                phoneNumber,
                displayName,
                uid,
                photoURL
              } = userCredentials.user;
              const currentUser = auth.currentUser;
              const isWholesaleUser = currentUser
                ? (await currentUser.getIdTokenResult()).claims.isWholesaleUser
                : false;
              commit('setAllStateInObj', {
                email,
                phoneNumber,
                displayName,
                uid,
                photoURL,
                isWholesaleUser
              });
            }
            break;
          }
          case 'facebook': {
            const facebook = new fb.auth.FacebookAuthProvider();
            const userCredentials = await auth.signInWithPopup(facebook);
            if (userCredentials && userCredentials.user) {
              const {
                email,
                phoneNumber,
                displayName,
                uid,
                photoURL
              } = userCredentials.user;
              const currentUser = auth.currentUser;
              const isWholesaleUser = currentUser
                ? (await currentUser.getIdTokenResult()).claims.isWholesaleUser
                : false;
              commit('setAllStateInObj', {
                email,
                phoneNumber,
                displayName,
                uid,
                photoURL,
                isWholesaleUser
              });
            }
            break;
          }
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};

export default UserModule;
