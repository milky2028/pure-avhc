<template>
  <button :class="$style['icon-wrapper']">
    <slot></slot>
  </button>
</template>

<style module>
.icon-wrapper {
  font-family: 'Material Icons';
  color: white;
  font-size: 24px;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>
