<template>
  <div class="selector">
    <select
      :value="selectValue"
      class="border"
      @input="$emit('select-changed', $event.target.value)"
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
  grid-template-areas: 'main';
}

select {
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  grid-area: main;
  padding: 2px;
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