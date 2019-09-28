<template>
  <label for="selector">
    <span class="body-text label-text">{{ label }}</span>
    <div class="select-container">
      <select @input="$emit('select-change', $event.target.value)" :value="boundProp">
        <option v-for="opt of options" :value="opt.value" :key="opt[loopKey]">{{ opt[displayKey] }}</option>
      </select>
      <av-icon-button black>expand_more</av-icon-button>
    </div>
  </label>
</template>

<style scoped>
label {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
}

.label-text {
  font-size: 14px;
}

select {
  font-size: 18px;
  margin-left: -5px;
  font-weight: 600;
}

.select-container {
  display: flex;
  justify-content: space-between;
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
    options: Array,
    label: String,
    loopKey: String,
    displayKey: String,
    boundProp: String
  }
});
</script>