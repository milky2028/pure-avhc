<template>
  <main>
    <av-toolbar></av-toolbar>
    <router-view/>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');

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
  --accent-color: #25ac6a;
  --elianto: 'Elianto', sans-serif;
  --mat-ease: cubic-bezier(0.4, 0, 0.2, 1);
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
  color: inherit;
  text-decoration: none;
}

body {
  overscroll-behavior: none;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvToolbar from './components/AvToolbar.vue';

export default Vue.extend({
  components: {
    AvToolbar
  }
});
</script>
