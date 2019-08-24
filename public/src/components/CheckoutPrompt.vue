<template>
  <div class="prompt">
    <h2 class="subhead checkout">Checkout ></h2>
  </div>
</template>

<style scoped>
.prompt {
  padding: 8px 16px 12px 16px;
  z-index: 15;
  position: fixed;
  bottom: 0;
  height: 55px;
  background-color: var(--snackbar-color);
  width: 100%;
  box-shadow: var(--basic-shadow);
  display: grid;
  align-items: center;
}

.checkout {
  color: white;
  justify-self: end;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({});
</script>