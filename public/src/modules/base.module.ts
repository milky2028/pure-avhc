// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase, { Logo } from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';

export interface Context {
  commit: Commit;
}

export interface BaseModule {
  namespaced: true;
  state: AppBase;
  mutations: {
    setAppBase: (state: AppBase, payload: { type: string; data: Logo }) => void;
    toggleOverlay: (state: AppBase) => void;
    setOverlayState: (state: AppBase, payload: boolean) => void;
  };
  actions: {
    getAppBase: (context: Context) => Promise<void>;
  };
}

const BaseModule: BaseModule = {
  namespaced: true,
  state: {
    isOverlayShowing: false,
    toolbarLogo: {
      type: '',
      text: '',
      url: '',
      alt: ''
    }
  },
  mutations: {
    setAppBase: (state, payload) => (state[payload.type] = payload.data),
    toggleOverlay: (state) =>
      (state.isOverlayShowing = !state.isOverlayShowing),
    setOverlayState: (state, payload) => (state.isOverlayShowing = payload)
  },
  actions: {
    async getAppBase({ commit }) {
      const worker = new Worker();
      const workerMsg: WorkerFns = { fn: 'getApplicationBase' };
      worker.postMessage(workerMsg);
      worker.addEventListener('message', (msg: MessageEvent) => {
        Object.keys(msg.data).forEach((key) => {
          commit('setAppBase', { type: key, data: msg.data[key] });
        });
      });
    }
  }
};

export default BaseModule;
