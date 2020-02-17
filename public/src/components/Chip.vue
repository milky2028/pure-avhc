<template>
  <div class="chip-container">
    <av-icon-button
      class="icon-btn border"
      @icon-click="$emit('remove-clicked')"
    >
      remove_circle_outline
    </av-icon-button>
    <span class="body-text"><slot /></span>
  </div>
</template>

<style scoped>
.chip-container {
  justify-self: end;
  color: white;
  background-color: var(--dark-accent);
  width: max-content;
  padding: 0.5rem 1.5rem;
  display: grid;
  grid-auto-flow: column;
  column-gap: 1rem;
  border-radius: 30px;
}
</style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import AvIconButton from './AvIconButton.vue';

export default createComponent({
  components: {
    AvIconButton
  }
});
</script>
