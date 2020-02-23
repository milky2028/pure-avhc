<template>
  <button
    v-bind="$attrs"
    :class="{ flat, long, fullWidth, raised: !flat }"
    @click="$emit('btn-click', $event)"
  >
    <span>
      <slot />
    </span>
    <span v-if="icon" class="icon">{{ icon }}</span>
  </button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: space-around;
  color: white;
  background-color: var(--dark-accent);
  text-transform: uppercase;
  font-family: var(--mukta-malar);
  box-shadow: var(--basic-shadow);
  padding: 10px 2rem;
  font-size: 18px;
  border-radius: 19px;
  font-weight: 500;
  align-items: center;
  transition: all 150ms var(--mat-ease);
  width: max-content;
  letter-spacing: 0.1em;
}

button:disabled {
  box-shadow: none;
  background-color: grey;
}

span {
  text-align: center;
  line-height: 1;
}

button:hover.raised:not(:disabled) {
  background-color: var(--dark-accent-light-shade);
}

button:active.raised:not(:disabled) {
  box-shadow: none;
  background-color: var(--dark-accent-dark-shade);
}

button:hover.flat:not(:disabled) {
  background-color: var(--light-accent-faint-shade);
}

button:active.flat:not(:disabled) {
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
  padding: 10px 4rem;
}

.fullWidth {
  justify-content: center;
  width: max-content;
  margin: 0 auto;
  width: 100%;
}

.icon {
  text-transform: none;
  font-family: 'Material Icons';
  color: white;
  font-size: 20px;
  transition: color 100ms var(--mat-ease);
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    fullWidth: Boolean,
    long: Boolean,
    icon: String,
    flat: Boolean
  }
});
</script>
