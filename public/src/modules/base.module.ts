// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase from '@/types/AppBase';
import {IFirebaseWorker} from '@/actors/firebase.worker';
import {Commit} from 'vuex';

interface Context {
  commit: Commit;
}

export interface BaseModule {
  namespaced: true;
  state: AppBase | {};
  mutations: {
    setAppBase: (state: AppBase, payload: AppBase) => void;
  };
  actions: {
    getAppBase: (context: Context) => Promise<void>;
  };
}

const BaseModule: BaseModule = {
  namespaced: true,
  state: {},
  mutations: {
    setAppBase: (state, payload) => (state = payload)
  },
  actions: {
    async getAppBase({commit}) {
      const worker = new Worker();
      worker.postMessage({fn: 'getApplicationBase'});
      worker.addEventListener('message', (msg: MessageEvent) => {
        commit('setAppBase', msg.data);
      });
    }
  }
};

export default BaseModule;
