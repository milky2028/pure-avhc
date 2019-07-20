<template>
  <section class="page" :class="{ withPadding }">
    <slot></slot>
  </section>
</template>

<style scoped>
.page {
  padding-top: 55px;
}

.withPadding {
  padding: calc(55px + 3vh) 0 2vh 4vw;
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    withPadding: Boolean
  }
});
</script>

