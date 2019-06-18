<template>
  <div id="app">
    <app-toolbar></app-toolbar>
    <router-view/>
  </div>
</template>

<style>
:root {
  --primary-color: #000E33;
}

* {
  box-sizing: border-box;
  outline: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body, html {
  margin: 0;
  padding: 0;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AppToolbar from './components/AppToolbar.vue';

export default Vue.extend({
  components: {
    AppToolbar
  }
});
</script>
