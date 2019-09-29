// @ts-ignore
import Worker from 'worker-loader!../workers/firebase.worker';
import User from '@/types/User';
import setState from '@/functions/setState';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import router from '@/router';

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
    signInWithProvider({ commit }: Context, payload: { provider: string }) {
      const worker = new Worker();
      const workerMsg: WorkerFns = {
        fn: 'signInWithProvider',
        collection: 'auth',
        payload
      };
      worker.postMessage(workerMsg);

      return new Promise((resolve, reject) => {
        worker.addEventListener('message', ({ data }: MessageEvent) => {
          console.log(data);
          if (data.collection === 'auth') {
            resolve(data);
          } else {
            reject();
          }
        });
      });
    }
  }
};

export default UserModule;
