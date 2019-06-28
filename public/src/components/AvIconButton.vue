<template>
  <button :class="$style['icon-wrapper']" @click="onClick">
    <slot></slot>
  </button>
</template>

<style module>
.icon-wrapper {
  cursor: pointer;
  font-family: 'Material Icons';
  color: white;
  font-size: 22px;
  transition: color 100ms var(--mat-ease);
}

.icon-wrapper:hover,
.icon-wrapper:focus {
  color: var(--accent-color);
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onClick(e: Event) {
      const target = e.target as HTMLButtonElement;
      this.$emit('icon-click', e);
    }
  }
});
</script>
