// @ts-ignore
import Worker from 'worker-loader!../workers/firebase.worker';
import User from '@/types/User';
import setState from '@/functions/setState';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import router from '@/router';
const Firebase = import(/* webpackChunkName: 'firebase' */ 'firebase/app');
const AuthImport = import(/* webpackChunkName: 'auth' */ 'firebase/auth');

interface Context {
  commit: Commit;
  state?: UserModuleState;
}

interface UserModuleState {
  isAdmin: boolean;
  userId: string;
  userDetails: User;
}

const UserModule = {
  namespaced: true,
  state: {
    isAdmin: false,
    userId: '',
    userDetails: {}
  },
  mutations: {
    setState
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
              commit('setState', { type: 'userId', data });
              router.push('/orders');
              resolve();
            }
          }
        });
      });
    },
    signOut({ commit }: Context) {
      const worker = new Worker();
      const workerMsg: WorkerFns = { fn: 'signOut', collection: 'auth' };

      worker.postMessage(workerMsg);
      commit('setState', { type: 'userId', data: '' });
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
              commit('setState', { type: 'userId', data: data.data });
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
            if (data.code) {
              reject(data.data.message);
            } else {
              commit('setState', { type: 'userId', data });
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
              commit('setState', {
                type: 'userId',
                data: userCredentials.user.uid
              });
            }
            break;
          }
          case 'facebook': {
            const facebook = new fb.auth.FacebookAuthProvider();
            const userCredentials = await auth.signInWithPopup(facebook);
            if (userCredentials && userCredentials.user) {
              commit('setState', {
                type: 'userId',
                data: userCredentials.user.uid
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
