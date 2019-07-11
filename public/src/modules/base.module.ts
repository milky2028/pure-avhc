// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase, { Logo } from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import { MenuItem } from '@/types/MenuItem';

export interface Context {
  commit: Commit;
  state?: AppBase;
}

export interface BaseModule {
  namespaced: true;
  state: AppBase;
  mutations: {
    setBaseData: (
      state: AppBase,
      payload: { type: string; data: Logo }
    ) => void;
    toggleOverlay: (state: AppBase) => void;
    setOverlayState: (state: AppBase, payload: boolean) => void;
  };
  actions: {
    getFirestoreData: (context: Context, workerMsg: WorkerFns) => Promise<void>;
  };
}

const BaseModule: BaseModule = {
  namespaced: true,
  state: {
    imageUrl: 'https://res.cloudinary.com/pure-avhc/image/upload/',
    isOverlayShowing: false,
    appLogoMin: {
      type: '',
      text: '',
      url: '',
      alt: '',
      site: '',
      size: ''
    },
    appLogoFull: {
      type: '',
      text: '',
      site: '',
      size: '',
      subtext: ''
    },
    submenu: []
  },
  mutations: {
    setBaseData: (state, payload) => (state[payload.type] = payload.data),
    toggleOverlay: (state) =>
      (state.isOverlayShowing = !state.isOverlayShowing),
    setOverlayState: (state, payload) => (state.isOverlayShowing = payload)
  },
  actions: {
    async getFirestoreData({ commit }, workerMsg) {
      const worker = new Worker();
      worker.postMessage(workerMsg);
      worker.addEventListener('message', (msg: MessageEvent) => {
        const firestoreData = msg.data.data;
        switch (msg.data.collection) {
          case 'logos': {
            const minLogo = firestoreData.find(
              (doc: Logo) => doc.size === 'min'
            );
            const fullLogo = firestoreData.find(
              (doc: Logo) => doc.size === 'full'
            );

            commit('setBaseData', { type: 'appLogoMin', data: minLogo });
            commit('setBaseData', { type: 'appLogoFull', data: fullLogo });
            break;
          }
          case 'submenu': {
            commit('setBaseData', { type: 'submenu', data: firestoreData });
            break;
          }
        }
      });
    }
  }
};

export default BaseModule;
