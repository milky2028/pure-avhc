<template>
  <button
    class="elianto-btn"
    @click="$emit('btn-click', $event)"
    :class="{ borderLeft, borderRight, borderBottom, borderTop, halfBorderLeft, halfBorderRight, hover: !noHover }"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.elianto-btn {
  width: 100%;
  background-color: white;
  padding: 14px;
  text-transform: uppercase;
  font-family: var(--elianto);
  font-size: 26px;
  transition: 50ms var(--mat-ease);
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

.hover:hover,
.hover:active {
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
    borderTop: Boolean,
    noHover: Boolean
  }
});
</script>
