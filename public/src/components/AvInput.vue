<template>
  <div>
    <label v-if="label" :for="fieldId">{{ label }}</label>
    <input
      @input="$emit('on-input', $event.target.value)"
      @keyup.enter="$emit('enter', $event.target.value)"
      @blur="dirty = true"
      :placeholder="placeholder"
      :class="{ darkBackground, dirty }"
      :style="{ width }"
    />
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
  },
  data() {
    return {
      dirty: false
    };
  }
});
</script>