// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase, { Logo } from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';

export interface Context {
  commit: Commit;
  state?: AppBase;
}

interface Mutation {
  type: string;
  data: any;
}

const BaseModule = {
  namespaced: true,
  state: {
    imageUrl: 'https://res.cloudinary.com/pure-avhc/image/upload/',
    isOverlayShowing: false,
    isDisclaimerShowing: false,
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
    submenu: [],
    products: [],
    mainMenu: [],
    iconMenu: []
  },
  mutations: {
    setState: (state: AppBase, { type, data }: Mutation) =>
      (state[type] = data),
    toggleOverlay: (state: AppBase) =>
      (state.isOverlayShowing = !state.isOverlayShowing),
    toggleDisclaimer: (state: AppBase) =>
      (state.isDisclaimerShowing = !state.isDisclaimerShowing)
  },
  actions: {
    async getFirestoreData({ commit }: Context, workerMsg: WorkerFns) {
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

            commit('setState', { type: 'appLogoMin', data: minLogo });
            commit('setState', { type: 'appLogoFull', data: fullLogo });
            break;
          }
          default: {
            commit('setState', {
              type: msg.data.collection,
              data: firestoreData
            });
            break;
          }
        }
      });
    }
  }
};

export default BaseModule;
