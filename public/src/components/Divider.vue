<template>
  <div class="divider" :class="{ noBottomMargin, white }" />
</template>

<style scoped>
.divider {
  background-color: black;
  height: 2px;
  margin-bottom: 1vh;
}

.noBottomMargin {
  margin-bottom: 0;
}

.white {
  background-color: white;
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  props: {
    noBottomMargin: Boolean,
    white: {
      type: Boolean,
      default: false
    }
  }
});
</script>
