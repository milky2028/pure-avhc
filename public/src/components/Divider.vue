<template>
  <div
    class="divider"
    :class="{ noBottomMargin }"
  />
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
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
export default createComponent({
  props: {
    noBottomMargin: Boolean
  }
});
</script>