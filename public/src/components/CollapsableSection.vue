<template>
  <div class="cs-container">
    <div class="header-container" :class="{ marginBottom: isExpanded }">
      <slot name="header" />
      <AvIconButton
        class="edit-icon"
        black
        @icon-click="$emit('edit-clicked')"
        >{{ isExpanded ? 'close' : 'edit' }}</AvIconButton
      >
    </div>
    <div>
      <slot name="constant" />
    </div>
    <div v-if="!isExpanded">
      <slot name="collapsed" />
    </div>
    <div v-if="isExpanded">
      <slot name="expanded" />
    </div>
  </div>
</template>

<style scoped>
.cs-container {
  display: grid;
  padding: 1rem 0;
  border-bottom: var(--faint-grey);
}

.header-container {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
}

.marginBottom {
  margin-bottom: 1rem;
}

.edit-icon {
  justify-self: end;
}

.continue {
  margin-top: 2rem;
  justify-self: end;
}
</style>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import AvButton from './AvButton.vue';
import AvIconButton from './AvIconButton.vue';
import { useWindowWidth } from '../use/window-width';

interface Props {
  isExpanded: boolean;
}

export default defineComponent<Props>({
  components: {
    AvButton,
    AvIconButton
  },
  props: {
    isExpanded: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { windowWidth } = useWindowWidth();
    return { windowWidth };
  }
});
</script>
