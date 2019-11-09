<template>
  <div class="divider" :class="{ noBottomMargin }"></div>
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
import Vue from 'vue';
export default Vue.extend({
  props: {
    noBottomMargin: Boolean
  }
});
</script>