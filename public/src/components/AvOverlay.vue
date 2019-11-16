<template>
  <transition name="fade">
    <div
      v-if="isOverlayShowing"
      class="overlay"
      @click="onOverlayClick"
    />
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
  transition: opacity 100ms var(--mat-ease);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import useOverlay from '../use/overlay';
import useNavbar from '../use/navbar';

export default createComponent({
  setup() {
    const { toggleOverlay, isOverlayShowing } = useOverlay();
    const { toggleNavbar } = useNavbar();

    function onOverlayClick() {
      toggleOverlay();
      toggleNavbar();
    }

    return { onOverlayClick, isOverlayShowing };
  }
});
</script>

