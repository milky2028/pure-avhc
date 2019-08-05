// @ts-ignore
import Worker from 'worker-loader!../actors/firebase.worker';
import AppBase, { Logo } from '@/types/AppBase';
import { Commit } from 'vuex';
import WorkerFns from '@/types/WorkerFns';
import setState from '../actors/setState';
import Product from '@/types/Product';

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
    getFirestoreData: async ({ commit }: Context, workerMsg: WorkerFns) => {
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
          // case 'products': {
          //   const data = firestoreData.map((product: Product) => ({
          //     ...product,
          //     dateCreated:
          //       product && product.dateCreated
          //         ? product.dateCreated.toDate()
          //         : null
          //   }));
          //   commit('setState', { type: 'products', data });
          //   break;
          // }
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
