<template>
  <button @click="$emit('btn-click', $event)" :class="{ flat, long, fullWidth, raised: !flat }">
    <span>
      <slot></slot>
    </span>
    <span class="icon" v-if="icon">{{ icon }}</span>
  </button>
</template>

<style scoped>
button {
  display: flex;
  color: white;
  background-color: var(--dark-accent);
  text-transform: uppercase;
  font-family: var(--mukta-malar);
  box-shadow: var(--basic-shadow);
  padding: 6px 12px;
  font-size: 18px;
  border-radius: var(--rounded-corner);
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
  transition: all 150ms var(--mat-ease);
}

button:hover.raised {
  background-color: var(--dark-accent-light-shade);
}

button:active.raised {
  box-shadow: none;
  background-color: var(--dark-accent-dark-shade);
}

button:hover.flat {
  background-color: var(--light-accent-faint-shade);
}

button:active.flat {
  box-shadow: none;
  background-color: var(--light-accent-light-shade);
}

.flat {
  background-color: transparent;
  box-shadow: none;
  color: var(--dark-accent);
  font-weight: 600;
}

.long {
  padding: 6px 60px;
}

.fullWidth {
  justify-content: center;
  width: 100%;
}

.icon {
  padding: 0 0 2px 5px;
  text-transform: none;
  font-family: 'Material Icons';
  color: white;
  font-size: 20px;
  transition: color 100ms var(--mat-ease);
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    fullWidth: Boolean,
    long: Boolean,
    icon: String,
    flat: Boolean
  }
});
</script>


