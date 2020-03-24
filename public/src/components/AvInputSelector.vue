<template>
  <div class="selector">
    <label v-if="label" class="body-text" :for="fieldId">{{ label }}</label>
    <select
      :name="fieldId"
      v-bind="$attrs"
      :class="{ dark }"
      @input="$emit('on-select', $event.target.value)"
    >
      <option
        v-for="{ key, value, displayValue } of options"
        :key="key"
        :value="value"
        >{{ displayValue }}</option
      >
    </select>
    <AvIcon class="icon" @icon-click="$event.preventDefault()"
      >expand_more</AvIcon
    >
  </div>
</template>

<style scoped>
.selector {
  display: grid;
  grid-auto-flow: row;
  grid-template-areas:
    'label'
    'main';
}

label {
  grid-area: label;
  margin-left: 10px;
}

select::placeholder {
  color: white;
  opacity: 0.4;
}

select {
  grid-area: main;
  appearance: none;
  font-size: 2rem;
  width: 100%;
  background-color: white;
  padding: 10px;
  border-radius: var(--rounded-corner);
  border: 2px solid var(--dark-accent);
}

.icon {
  grid-area: main;
  justify-self: end;
  margin-right: 1rem;
}

.dark {
  color: white;
  background-color: var(--navy);
}
</style>

<script lang="ts">
import createRandomId from '../functions/createRandomId';
import { defineComponent } from '@vue/composition-api';
import AvIcon from './AvIconButton.vue';

export default defineComponent({
  inheritAttrs: false,
  props: {
    options: Array,
    label: String,
    dark: Boolean,
    value: String
  },
  components: {
    AvIcon
  },
  setup() {
    const fieldId = createRandomId();
    return { fieldId };
  }
});
</script>
