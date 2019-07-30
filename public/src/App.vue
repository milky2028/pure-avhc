<template>
  <main>
    <av-toolbar></av-toolbar>
    <router-view />
    <av-overlay></av-overlay>
    <av-disclaimer></av-disclaimer>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');
@import url('https://fonts.googleapis.com/css?family=Mukta+Malar:300,400,500,600,700,800&display=swap');

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
  --primary-color: #000a23;
  --light-accent: #25ac6a;
  --dark-accent: #004d40;
  --dark-accent-light-shade: #006352;
  --dark-accent-dark-shade: #004a3e;
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
}

* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
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

.subhead {
  font-size: 22px;
  font-family: var(--mukta-malar);
  text-transform: uppercase;
  font-weight: 600;
  line-height: 0.7;
  letter-spacing: 0.15em;
}

.body-text {
  font-size: 16px;
  font-family: var(--mukta-malar);
  font-weight: 400;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms var(--mat-ease);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
import AvToolbar from './components/AvToolbar.vue';
import AvDisclaimer from './components/AvDisclaimer.vue';

export default Vue.extend({
  components: {
    AvToolbar,
    AvOverlay: () =>
      import(/* webpackChunkName: "AvOverlay" */ './components/AvOverlay.vue'),
    AvDisclaimer
  }
});
</script>
