<template>
  <div class="selector">
    <label class="body-text" :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="selectValue"
      class="border"
      @input="onSelectChanged($event.target.value)"
    >
      <option
        v-for="option of options"
        :value="valueKey ? option[valueKey] : option"
        :key="diffKey ? option[diffKey] : option"
      >
        {{ displayKey && displayValueHandler
        ? displayValueHandler(option[displayKey])
        : displayValueHandler
        ? displayValueHandler(option)
        : displayKey
        ? option[displayKey]
        : option }}
      </option>
    </select>
    <av-icon-button class="icon-btn border" black>expand_more</av-icon-button>
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
  font-size: 2rem;
}

select {
  font-size: 2rem;
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  grid-area: main;
  padding: 0.25rem;
  border-radius: 0;
  z-index: 10;
}

.icon-btn {
  grid-area: main;
  justify-self: end;
  background-color: white;
  z-index: 11;
}

.border {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}
</style>

<script lang="ts">
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';
import { ref, SetupContext, createComponent } from '@vue/composition-api';

interface Props {
  label: string;
  selectValue: string;
  options: any[];
  diffKey: string;
  displayKey: string;
  valueKey: string;
  displayValueHandler: () => void;
}

export default createComponent({
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
  setup(_: Props, { emit }: SetupContext) {
    const id = ref(createRandomId(5));

    function onSelectChanged(value: string) {
      emit('select-changed', value);
    }

    return { id, onSelectChanged };
  }
});
</script>