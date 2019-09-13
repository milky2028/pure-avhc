// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase, { Logo } from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import setState from '../actors/setState';

interface Context {
  commit: Commit;
  state?: AppBase;
}

const BaseModule = {
  namespaced: true,
  state: {
    imageUrl: 'https://res.cloudinary.com/pure-avhc/image/upload/',
    isNavbarExpanded: false,
    isOverlayShowing: false,
    isDisclaimerShowing: false,
    submenu: [],
    products: [],
    mainMenu: [],
    iconMenu: [],
    images: []
  },
  mutations: {
    setState,
    toggleOverlay: (state: AppBase) =>
      (state.isOverlayShowing = !state.isOverlayShowing),
    toggleDisclaimer: (state: AppBase) =>
      (state.isDisclaimerShowing = !state.isDisclaimerShowing),
    toggleNavbar: (state: AppBase) =>
      (state.isNavbarExpanded = !state.isNavbarExpanded)
  },
  actions: {
    addFirestoreData: (
      {  }: Context,
      workerMsg: WorkerFns
    ): Promise<string> => {
      const worker = new Worker();
      worker.postMessage(workerMsg);

      return new Promise((resolve) => {
        worker.addEventListener('message', ({ data }: MessageEvent) =>
          resolve(data)
        );
      });
    },
    getFirestoreData: async ({ commit }: Context, workerMsg: WorkerFns) => {
      const worker = new Worker();
      worker.postMessage(workerMsg);
      worker.addEventListener('message', (msg: MessageEvent) => {
        const firestoreData = msg.data.data;
        switch (msg.data.collection) {
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
