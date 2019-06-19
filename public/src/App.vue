<template>
  <div id="app">
    <av-toolbar></av-toolbar>
    <router-view/>
  </div>
</template>

<style>
:root {
  --primary-color: #000e33;
}

* {
  box-sizing: border-box;
  outline: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body,
html {
  margin: 0;
  padding: 0;
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
