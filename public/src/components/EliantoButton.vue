<template>
  <button
    @click="$emit('btn-click', $event)"
    :class="{ borderLeft, borderRight, borderBottom, borderTop, halfBorderLeft, halfBorderRight }"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  width: 100%;
  background-color: white;
  padding: 18px;
  text-transform: uppercase;
  font-family: var(--elianto);
  font-size: 26px;
  transition: 100ms ease-in;
  cursor: pointer;
}

.borderLeft {
  border-left: 3px black solid;
}

.borderRight {
  border-right: 3px black solid;
}

.halfBorderLeft {
  border-left: 1.5px black solid;
}

.halfBorderRight {
  border-right: 1.5px black solid;
}

.borderTop {
  border-top: 3px black solid;
}

.borderBottom {
  border-bottom: 3px black solid;
}

button:hover,
button:focus {
  background-color: black;
  color: white;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    borderLeft: Boolean,
    borderRight: Boolean,
    halfBorderLeft: Boolean,
    halfBorderRight: Boolean,
    borderBottom: Boolean,
    borderTop: Boolean
  }
});
</script>
