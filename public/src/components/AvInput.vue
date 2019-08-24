<template>
  <div>
    <label v-if="label" :for="fieldId">{{ label }}</label>
    <input :placeholder="placeholder" :class="{ darkBackground }" :style="{ width }" />
  </div>
</template>

<style scoped>
input {
  background-color: white;
  padding: 10px;
  border-radius: var(--rounded-corner);
}

.darkBackground {
  color: white;
  background-color: var(--primary-color);
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    placeholder: String,
    label: String,
    darkBackground: Boolean,
    width: String
  }
});
</script>