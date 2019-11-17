<template>
  <label :for="id">
    <span class="body-text label-text">{{ label }}</span>
    <div class="select-container">
      <select
        :id="id"
        :value="boundProp"
        @input="$emit('select-change', $event.target.value)"
      >
        <option v-for="opt of options" :key="opt[loopKey]" :value="opt.value">{{
          opt[displayKey]
        }}</option>
      </select>
      <AvIconButton black>expand_more</AvIconButton>
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
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  components: {
    AvIconButton
  },
  props: {
    options: Array,
    label: String,
    loopKey: String,
    displayKey: String,
    boundProp: String
  },
  setup() {
    const id = createRandomId();
    return { id };
  }
});
</script>
