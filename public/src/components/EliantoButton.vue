<template>
  <button
    class="subhead elianto-btn"
    :class="{
      borderBottom,
      borderTop,
      hover: !noHover
    }"
    @click="$emit('btn-click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.elianto-btn {
  width: 100%;
  background-color: white;
  padding: 14px;
  font-size: 24px;
  transition: 50ms var(--mat-ease);
  cursor: pointer;
  line-height: 32px;
}

.borderTop {
  border-top: 3px black solid;
}

.borderBottom {
  border-bottom: 3px black solid;
}

.hover:hover,
.hover:active {
  background-color: black;
  color: white;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';

export default createComponent({
  props: {
    borderBottom: Boolean,
    borderTop: Boolean,
    noHover: Boolean
  }
});
</script>
