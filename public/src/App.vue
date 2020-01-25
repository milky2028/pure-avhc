<template>
  <main
    :class="{
      bottomPadding: (cartItems && cartItems.length > 0) || snackbarMsg
    }"
  >
    <AvToolbar @fda="showDisclaimer()" />
    <router-view />
    <AvOverlay />
    <AvDisclaimer />
    <CheckoutPrompt />
    <AvSnackbar />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');
@import url('https://fonts.googleapis.com/css?family=Mukta+Malar:400,500,600,700,800&display=swap');

@font-face {
  font-family: 'Elianto';
  src: url('./assets/fonts/elianto.woff2') format('woff2'),
    url('./assets/fonts/elianto.woff') format('woff'),
    url('./assets/fonts/elianto.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  font-size: 8px;
  --primary-color: #000a23;
  --light-accent: #25ac6a;
  --dark-accent: #004d40;
  --dark-accent-light-shade: #006352;
  --dark-accent-dark-shade: #004a3e;
  --warn: #d32f2f;
  --light-accent-faint-shade: rgba(37, 172, 106, 0.08);
  --light-accent-light-shade: rgba(37, 172, 106, 0.15);
  --snackbar-color: #2e2e2e;
  --basic-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --elianto: 'Elianto', sans-serif;
  --mukta-malar: 'Mukta Malar', sans-serif;
  --mat-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --mat-enter: cubic-bezier(0, 0, 0.2, 1);
  --mat-leave: cubic-bezier(0.4, 0, 1, 1);
  --rounded-corner: 5px;
  --faint-grey: 1px solid rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  vertical-align: baseline;
  background: transparent;
  box-sizing: border-box;
  outline: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a,
a:visited {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  transition: color 100ms var(--mat-ease);
}

button {
  cursor: pointer;
}

ul {
  list-style: none;
}

body {
  overscroll-behavior-y: none;
}

.bottomPadding {
  padding-bottom: 55px;
}

.subhead {
  font-size: 22px;
  font-family: var(--mukta-malar);
  text-transform: uppercase;
  font-weight: 600;
  line-height: 0.7;
  letter-spacing: 0.15em;
}

.body-text {
  font-size: 2rem;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: opacity 100ms var(--mat-ease);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-move {
  transition: all 100ms var(--mat-ease);
}

.slide-y-enter-active {
  transition: all 250ms var(--mat-enter);
}

.slide-y-leave-active {
  transition: all 250ms var(--mat-leave);
}

.slide-y-enter,
.slide-y-leave-to {
  transform: translateY(calc(100% + 75px));
}
</style>

<script lang="ts">
import Vue from 'vue';
import {
  createComponent,
  onMounted,
  inject,
  provide
} from '@vue/composition-api';
import AvToolbar from './components/AvToolbar.vue';
import { useEvent } from './use/event';
import { ISnackbar } from './use/snackbar';
import { ICart } from './use/cart';
import { IUser } from './use/user';
import { Modules, Store } from './use/store';
import { IDisclaimer } from './use/disclaimer';

export default createComponent({
  components: {
    AvToolbar,
    AvDisclaimer: () =>
      import(
        /* webpackChunkName: "AvDisclaimer" */
        './components/AvDisclaimer.vue'
      ),
    AvOverlay: () =>
      import(
        /* webpackChunkName: "AvOverlay" */
        './components/AvOverlay.vue'
      ),
    CheckoutPrompt: () =>
      import(
        /* webpackChunkName: "CheckoutPrompt" */
        './components/CheckoutPrompt.vue'
      ),
    AvSnackbar: () =>
      import(
        /* webpackChunkName: "AvSnackbar" */
        './components/AvSnackbar.vue'
      )
  },
  setup() {
    for (const symbol of Object.getOwnPropertySymbols(Store)) {
      // @ts-ignore;
      provide(symbol, Store[symbol]);
    }

    useEvent('beforeinstallprompt', (e) => e.preventDefault());
    const { cartItems, setCartStateFromIdb } = inject(Modules.cart) as ICart;
    const { listenForAuthStateChanges } = inject(Modules.user) as IUser;
    const { snackbarMsg } = inject(Modules.snackbar) as ISnackbar;
    const { showDisclaimer } = inject(Modules.disclaimer) as IDisclaimer;

    onMounted(async () => {
      setCartStateFromIdb();
      listenForAuthStateChanges();
      const mode = process.env.NODE_ENV;
      if (mode === 'production') {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js');
        }

        const Sentry = await import(
          /* webpackChunkName: "SentryBrowser" */ '@sentry/browser'
        );
        const Integrations = await import(
          /* webpackChunkName: "SentryIntegrations" */ '@sentry/integrations'
        );

        Sentry.init({
          dsn: 'https://362776d26eaf4ef4a02da8d50efc9072@sentry.io/1271986',
          integrations: [
            new Integrations.Vue({ Vue, attachProps: true, logErrors: true })
          ]
        });
      }
    });

    return { snackbarMsg, cartItems, showDisclaimer };
  }
});
</script>
