<template>
  <button class="icon-wrapper" :class="{ black }" @click="onClick">
    <slot></slot>
  </button>
</template>

<style scoped>
.icon-wrapper {
  font-family: 'Material Icons';
  color: white;
  font-size: 22px;
  transition: color 100ms var(--mat-ease);
}

.icon-wrapper:hover,
.icon-wrapper:focus {
  color: var(--light-accent);
}

.black {
  color: black;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    black: Boolean
  },
  methods: {
    onClick(e: Event) {
      const target = e.target as HTMLButtonElement;
      this.$emit('icon-click', e);
    }
  }
});
</script>
