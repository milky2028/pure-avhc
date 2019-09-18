<template>
  <label for="selector">
    <span class="body-text">{{ label }}</span>
    <select @input="$emit('select-change', $event.target.value)" :value="boundProp">
      <option v-for="opt of options" :value="opt.value" :key="opt[loopKey]">{{ opt[displayKey] }}</option>
    </select>
  </label>
</template>

<style scoped>
label {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    options: Array,
    label: String,
    loopKey: String,
    displayKey: String,
    boundProp: String
  }
});
</script>