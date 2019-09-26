// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import User from '@/types/User';
import setState from '@/actors/setState';
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
      const workerMsg: WorkerFns = { fn: 'signInWithEmail', payload };

      worker.postMessage(workerMsg);
      worker.addEventListener('message', ({ data }: MessageEvent) => {
        console.log(data);
        // commit('setState', { type: 'userId', data: data });
      });
    },
    signOut({ commit }: Context) {
      const worker = new Worker();
      const workerMsg: WorkerFns = { fn: 'signOut' };

      worker.postMessage(workerMsg);
      commit('setState', { type: 'userId', data: '' });
      router.push('/');
    }
  }
};

export default UserModule;
