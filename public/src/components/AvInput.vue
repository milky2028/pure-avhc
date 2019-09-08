<template>
  <label :for="fieldId">
    {{ label }}
    <input
      :id="fieldId"
      v-bind="$attrs"
      @input="$emit('on-input', $event.target.value)"
      @keyup.enter="$emit('enter', $event.target.value)"
      @blur="dirty = true"
      :value="value"
      :class="{ darkBackground, dirty, error }"
      :style="{ width }"
    />
  </label>
</template>

<style scoped>
input {
  background-color: white;
  padding: 10px;
  border-radius: var(--rounded-corner);
  border: 1.3px solid;
  border-color: var(--dark-accent);
}

.darkBackground {
  color: white;
  background-color: var(--primary-color);
}

.error,
input.dirty:invalid {
  border-color: var(--warn);
}
</style>

<script lang="ts">
import Vue from 'vue';
import CreateRandomId from '../actors/createRandomId';

export default Vue.extend({
  inheritAttrs: false,
  props: {
    label: String,
    darkBackground: Boolean,
    width: String,
    value: String,
    error: Boolean
  },
  data() {
    return {
      dirty: false
    };
  },
  computed: {
    fieldId: () => CreateRandomId()
  }
});
</script>