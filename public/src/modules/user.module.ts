// @ts-ignore
import Worker from 'worker-loader!../functions/firebase.worker';
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
              reject();
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
    }
  }
};

export default UserModule;
