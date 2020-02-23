<template>
  <label :for="id" :class="{ borderTop, borderBottom, borderRight }">
    <span class="body-text label-text">{{ label }}</span>
    <div class="select-container">
      <select
        :id="id"
        :value="boundProp"
        @input="$emit('select-change', $event.target.value)"
      >
        <option
          v-for="opt of sortedOptions"
          :key="opt[loopKey]"
          :value="opt[valueKey ? valueKey : 'value']"
          >{{ opt[displayKey] }}</option
        >
      </select>
      <AvIconButton class="icon" black>expand_more</AvIconButton>
    </div>
  </label>
</template>

<style scoped>
label {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
}

.label-text {
  font-size: 14px;
}

select {
  grid-area: main;
  appearance: none;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  color: var(--dark-accent-light-shade);
  z-index: 15;
}

.select-container {
  display: grid;
  grid-template-areas: 'main';
}

.icon {
  grid-area: main;
  justify-self: end;
}

.borderTop {
  border-top: var(--faint-grey);
}

.borderBottom {
  border-bottom: var(--faint-grey);
}

.borderRight {
  border-right: var(--faint-grey);
}
</style>

<script lang="ts">
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';
import { defineComponent, computed } from '@vue/composition-api';

interface Props {
  valueKey: string;
  options: any[];
  label: string;
  loopKey: string;
  displayKey: string;
  boundProp: string;
  borderTop: boolean;
  borderBottom: boolean;
  borderRight: boolean;
}

export default defineComponent<Props>({
  components: {
    AvIconButton
  },
  props: {
    valueKey: String,
    options: Array,
    label: String,
    loopKey: String,
    displayKey: String,
    boundProp: String,
    borderTop: {
      type: Boolean,
      default: true
    },
    borderBottom: {
      type: Boolean,
      default: true
    },
    borderRight: Boolean
  },
  setup(props) {
    const id = createRandomId();

    const sortedOptions = computed(() =>
      props.options.sort((a, b) =>
        a[props.displayKey].localeCompare(b[props.displayKey])
      )
    );

    return { id, sortedOptions };
  }
});
</script>
