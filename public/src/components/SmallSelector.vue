<template>
  <div class="selector">
    <label class="body-text" :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="selectValue"
      class="border"
      @input="$emit('select-changed', $event.target.value)"
    >
      <option
        v-for="option of options"
        :key="diffKey ? option[diffKey] : option"
        :value="valueKey ? option[valueKey] : option"
      >
        {{
          displayKey && displayValueHandler
            ? displayValueHandler(option[displayKey])
            : displayValueHandler
            ? displayValueHandler(option)
            : displayKey
            ? option[displayKey]
            : option
        }}
      </option>
    </select>
    <av-icon-button class="icon-btn border" black>
      expand_more
    </av-icon-button>
  </div>
</template>

<style scoped>
.selector {
  display: grid;
  grid-auto-flow: column;
  grid-template-areas:
    'label'
    'main';
}

label {
  grid-area: label;
  font-size: 14px;
}

select {
  appearance: none;
  font-size: 14px;
  width: 100%;
  grid-area: main;
  padding: 0.25rem;
  border-radius: 0;
  z-index: 100;
}

.icon-btn {
  grid-area: main;
  justify-self: end;
  background-color: white;
  z-index: 11;
}

.border {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>

<script lang="ts">
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  components: {
    AvIconButton
  },
  props: {
    label: String,
    selectValue: String,
    options: Array,
    diffKey: String,
    displayKey: String,
    valueKey: String,
    displayValueHandler: Function
  },
  setup() {
    const id = createRandomId();
    return { id };
  }
});
</script>
