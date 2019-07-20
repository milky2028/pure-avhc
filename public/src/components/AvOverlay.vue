<template>
  <transition name="fade">
    <div v-if="isOverlayShowing" class="overlay" @click="onOverlayClick"></div>
  </transition>
</template>

<style scoped>
.overlay {
  position: absolute;
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
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapState('base', ['isOverlayShowing'])
  },
  methods: {
    ...mapMutations('base', ['toggleOverlay', 'toggleNavbar']),
    onOverlayClick() {
      this.toggleOverlay();
      this.toggleNavbar();
    }
  }
});
</script>

