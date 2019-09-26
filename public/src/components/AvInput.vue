<template>
  <div class="container">
    <label v-if="label" class="body-text" :for="fieldId">{{ label }}</label>
    <input
      :id="fieldId"
      v-bind="$attrs"
      @input="$emit('on-input', $event.target.value)"
      @keyup.enter="$emit('enter', $event.target.value)"
      @blur="dirty = true"
      :value="value"
      :class="{ darkBackground, dirty, showError, morePadding }"
      :style="{ width }"
    />
    <p v-if="useNativeFieldError && showError && errorMsg" class="body-text">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-auto-flow: row;
}

label {
  margin-left: 10px;
}

p {
  color: var(--warn);
  margin: 5px 0 0 5px;
  font-size: 14px;
}

input {
  background-color: white;
  padding: 10px;
  border-radius: var(--rounded-corner);
  border: 2px solid;
  border-color: var(--dark-accent);
}

.darkBackground {
  color: white;
  background-color: var(--primary-color);
}

.morePadding {
  padding: 12px;
}

.showError,
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
    morePadding: Boolean,
    width: String,
    value: String,
    useNativeFieldError: Boolean,
    showError: Boolean,
    errorMsg: String
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