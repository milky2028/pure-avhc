// @ts-ignore
import Worker from 'worker-loader!../workers/firebase.worker';
import AppBase from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import setState, { setAllStateInObj } from '../functions/setState';

interface Context {
  commit: Commit;
  state?: AppBase;
}

const BaseModule: {
  [key: string]: any;
  state: AppBase;
} = {
  namespaced: true,
  state: {
    imageUrl: 'https://res.cloudinary.com/pure-avhc/image/upload/',
    functionsUrl: process.env.VUE_APP_FUNCTIONS_URL as string,
    isNavbarExpanded: false,
    isOverlayShowing: false,
    isDisclaimerShowing: false,
    snackbarMsg: '',
    submenu: [],
    products: [],
    mainMenu: [],
    iconMenu: [],
    images: [],
    testResults: [],
    strains: [],
    wholesaleCatalog: []
  },
  mutations: {
    setState,
    setAllStateInObj,
    showSnackbar: (state: AppBase, msg: string) => (state.snackbarMsg = msg),
    closeSnackbar: (state: AppBase) => (state.snackbarMsg = ''),
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

      worker.addEventListener('message', ({ data }: MessageEvent) => {
        const firestoreData = data.data;
        if (Array.isArray(firestoreData)) {
          commit(
            `${
              workerMsg.targetModule ? `${workerMsg.targetModule}/` : ''
            }setState`,
            {
              type: data.collection,
              data: firestoreData
            },
            workerMsg.targetModule ? { root: true } : {}
          );
        } else if (typeof firestoreData === 'object') {
          commit(
            `${
              workerMsg.targetModule ? `${workerMsg.targetModule}/` : ''
            }setAllStateInObj`,
            firestoreData,
            workerMsg.targetModule ? { root: true } : {}
          );
        }
      });
    }
  }
};

export default BaseModule;
