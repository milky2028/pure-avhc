<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
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
export default Vue.extend({
  created() {
    console.log(this.doThing());
    this.doAnotherThing();
  },
  methods: {
    doThing() {
      return 'thing';
    },
    doAnotherThing() {
      return 10;
    }
  }
});
</script>
