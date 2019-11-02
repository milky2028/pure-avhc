<template>
  <div class="selector">
    <select :value="selectValue" @input="$emit('select-changed', $event.target.value)">
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
    <av-icon-button
      :style="{ marginLeft: `${String(selectValue).length / 1.9}ch` }"
      class="icon-btn"
      black
    >expand_more</av-icon-button>
  </div>
</template>

<style scoped>
.selector {
  display: grid;
  grid-auto-flow: column;
  grid-template-areas: 'main';
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  grid-area: main;
  padding: 2px;
  border-radius: 0;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  z-index: 10;
}

.icon-btn {
  grid-area: main;
  justify-self: end;
}
</style>

<script lang="ts">
import Vue from 'vue';
import AvIconButton from './AvIconButton.vue';

export default Vue.extend({
  components: {
    AvIconButton
  },
  props: {
    selectValue: String,
    options: Array,
    diffKey: String,
    displayKey: String,
    valueKey: String,
    displayValueHandler: Function
  }
});
</script>