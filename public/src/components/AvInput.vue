<template>
  <div class="input-container">
    <label v-if="label" class="body-text" :for="fieldId">{{ label }}</label>
    <input
      :id="fieldId"
      v-bind="$attrs"
      :list="datalist && datalist.length > 0 ? 'list' : ' '"
      :value="value"
      :class="{ dark, morePadding }"
      :style="{ width }"
      @input="$emit('on-input', $event.target.value)"
      @keyup.enter="$emit('enter', $event.target.value)"
    />
    <datalist v-if="datalist && datalist.length > 0" id="list">
      <option v-for="item of datalist" :key="item" :value="item">
        {{ item }}
      </option>
    </datalist>
  </div>
</template>

<style scoped>
.input-container {
  display: grid;
  grid-auto-flow: row;
}

label {
  margin-left: 10px;
}

input::placeholder {
  color: white;
  opacity: 0.4;
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
  padding: 10px;
}
</style>

<script lang="ts">
import createRandomId from '../functions/createRandomId';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: false,
  props: {
    datalist: Array,
    label: String,
    dark: Boolean,
    morePadding: Boolean,
    width: String,
    value: String
  },
  setup() {
    const fieldId = createRandomId();
    return { fieldId };
  }
});
</script>
