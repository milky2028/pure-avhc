<template>
  <div>
    <input
      :id="fieldId"
      :value="value"
      type="checkbox"
      class="checkbox"
      @input="$emit('switch', $event.target.checked)"
    />
    <label :for="fieldId" />
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
}

.checkbox {
  display: none;
}

.checkbox + label {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 19px;
  background: linear-gradient(
      to right,
      var(--warn) 0,
      #fc8b34 45%,
      #7fd03e 55%,
      var(--dark-accent) 100%
    )
    0 0;
  background-size: 130px 100%;
  border-radius: 70px;
  padding: 2px;
  cursor: pointer;
  transition: all 500ms ease;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.2) inset;
}

.checkbox + label:before {
  content: '';
  width: 15px;
  height: 15px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 100%;
  background: white;
  text-align: center;
  line-height: 15px;
  font-family: 'Cabin', sans-serif;
  font-size: 15px;
  font-weight: bold;
  color: var(--warn);
  letter-spacing: 3px;
  text-transform: uppercase;
  transition: left 200ms ease, color 200ms ease, transform 150ms ease;
}

.checkbox + label:active:before {
  transform: scale(0.95);
}

.checkbox:checked + label {
  background-position-x: -90px;
}

.checkbox:checked + label:before {
  content: '';
  color: var(--dark-accent);
  left: 23px;
}
</style>

<script lang="ts">
import createRandomId from '../functions/createRandomId';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  props: {
    value: Boolean
  },
  setup() {
    const fieldId = createRandomId();
    return { fieldId };
  }
});
</script>
