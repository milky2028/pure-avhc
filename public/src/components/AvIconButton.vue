<template>
  <button
    class="icon-wrapper"
    :class="{ black }"
    @click="$emit('icon-click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.icon-wrapper {
  font-family: 'Material Icons' !important;
  color: white;
  font-size: 22px;
  transition: color 100ms var(--ease);
  text-transform: none !important;
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
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    black: Boolean
  }
});
</script>
