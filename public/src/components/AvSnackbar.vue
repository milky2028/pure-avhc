<template>
  <transition name="slide-y">
    <div v-if="snackbarMsg" class="snackbar">
      <h2>{{ snackbarMsg }}</h2>
    </div>
  </transition>
</template>

<style scoped>
.snackbar {
  height: 55px;
  width: 100%;
  z-index: 20;
  background-color: var(--snackbar-color);
  position: fixed;
  bottom: 0;
}

h2 {
  margin: 15px 0 0 26px;
  color: white;
  font-size: 20px;
  font-family: var(--mukta-malar);
  font-weight: 500;
  line-height: 1.2;
}
</style>

<script lang="ts">
import { createComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { ISnackbar } from '../use/snackbar';

export default createComponent({
  setup() {
    const { snackbarMsg } = inject(Modules.snackbar) as ISnackbar;
    return { snackbarMsg };
  }
});
</script>
