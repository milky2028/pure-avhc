<template>
  <div class="container">
    <label v-if="label" class="body-text" :for="fieldId">{{ label }}</label>
    <input
      :id="fieldId"
      v-bind="$attrs"
      :list="datalist && datalist.length > 0 ? 'list' : ' '"
      :value="value"
      :class="{ dark, dirty, showError, morePadding }"
      :style="{ width }"
      @input="$emit('on-input', $event.target.value)"
      @keyup.enter="$emit('enter', $event.target.value)"
      @blur="dirty = true"
    />
    <datalist v-if="datalist && datalist.length > 0" id="list">
      <option v-for="item of datalist" :key="item" :value="item">
        {{ item }}
      </option>
    </datalist>
    <p v-if="useNativeFieldError && showError && errorMsg" class="body-text">
      {{ errorMsg }}
    </p>
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

input::placeholder {
  color: white;
  opacity: 0.3;
}

input {
  font-size: 2rem;
  width: 100%;
  background-color: white;
  padding: 10px;
  border-radius: var(--rounded-corner);
  border: 2px solid;
  border-color: var(--dark-accent);
}

.dark {
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
import createRandomId from '../functions/createRandomId';
import { createComponent, ref } from '@vue/composition-api';

export default createComponent({
  inheritAttrs: false,
  props: {
    datalist: Array,
    label: String,
    dark: Boolean,
    morePadding: Boolean,
    width: String,
    value: String,
    useNativeFieldError: Boolean,
    showError: Boolean,
    errorMsg: String
  },
  setup() {
    const dirty = ref(false);
    const fieldId = createRandomId();

    return { dirty, fieldId };
  }
});
</script>
