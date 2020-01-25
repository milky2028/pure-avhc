<template>
  <div class="container">
    <slot name="header" />
    <transition name="shrink">
      <div v-if="!isExpanded">
        <slot name="collapsed" />
      </div>
    </transition>
    <div v-if="isExpanded">
      <slot name="expanded" />
    </div>
    <AvIconButton
      v-if="!isExpanded"
      class="edit-icon"
      black
      @icon-click="$emit('edit-clicked')"
      >edit</AvIconButton
    >
    <AvButton
      v-if="isExpanded"
      class="continue"
      @btn-click="$emit('continue-clicked')"
    >
      Continue
    </AvButton>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  padding: 1rem 0 2rem;
  border-bottom: var(--faint-grey);
}

.header {
  margin-bottom: 2rem;
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
import { createComponent } from '@vue/composition-api';
import AvButton from './AvButton.vue';
import AvIconButton from './AvIconButton.vue';

interface Props {
  isExpanded: boolean;
}

export default createComponent<Props>({
  components: {
    AvButton,
    AvIconButton
  },
  props: {
    isExpanded: {
      type: Boolean,
      default: true
    }
  }
});
</script>
