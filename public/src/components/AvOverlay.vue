<template>
  <transition name="fade">
    <div v-if="isOverlayShowing" class="overlay" @click="onOverlayClick" />
  </transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 10;
  opacity: 0.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms var(--ease);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { IOverlay } from '../use/overlay';
import { INavbar } from '../use/navbar';

export default defineComponent({
  setup() {
    const { toggleOverlay, isOverlayShowing } = inject(
      Modules.overlay
    ) as IOverlay;
    const { toggleNavbar } = inject(Modules.navbar) as INavbar;

    function onOverlayClick() {
      toggleOverlay();
      toggleNavbar();
    }

    return { onOverlayClick, isOverlayShowing };
  }
});
</script>
