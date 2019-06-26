<template>
  <main>
    <av-toolbar></av-toolbar>
    <router-view/>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');

:root {
  --primary-color: #000a23;
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
import * as Comlink from 'comlink';
// @ts-ignore
import FirebaseWorker from 'worker-loader!./actors/firebase.worker';

export default Vue.extend({
  components: {
    AvToolbar
  },
  async mounted() {
    const FirebaseFacade = Comlink.wrap(new FirebaseWorker());
    const instance = await new FirebaseFacade();
    console.log(await instance.sayHello());
  }
});
</script>
