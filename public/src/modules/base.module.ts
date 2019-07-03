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
    getFirestoreData: (context: Context) => Promise<void>;
  };
}

const BaseModule: BaseModule = {
  namespaced: true,
  state: {
    isOverlayShowing: false,
    appLogoMin: {
      type: '',
      text: '',
      url: '',
      alt: ''
    },
    appLogoFull: {
      type: '',
      text: '',
      url: '',
      alt: ''
    },
    submenu: []
  },
  mutations: {
    setAppBase: (state, payload) => (state[payload.type] = payload.data),
    toggleOverlay: (state) =>
      (state.isOverlayShowing = !state.isOverlayShowing),
    setOverlayState: (state, payload) => (state.isOverlayShowing = payload)
  },
  actions: {
    async getFirestoreData({ commit }) {
      const worker = new Worker();
      const workerMsg: WorkerFns = { fn: 'getDocument', args: 'base' };
      worker.postMessage(workerMsg);
      worker.addEventListener('message', (msg: MessageEvent) => {
        Object.keys(msg.data.data).forEach((key) => {
          commit('setAppBase', { type: key, data: msg.data.data[key] });
        });
      });
    }
  }
};

export default BaseModule;
