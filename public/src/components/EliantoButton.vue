<template>
  <button
    class="subhead elianto-btn"
    :class="{
      thinBottom,
      hasBorder,
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

.hasBorder {
  border-top: 2px black solid;
  border-bottom: 2px black solid;
}

.hover:hover,
.hover:active {
  background-color: black;
  color: white;
}

.thinBottom {
  border-bottom: var(--faint-grey);
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    hasBorder: Boolean,
    noHover: Boolean,
    thinBottom: Boolean
  }
});
</script>
