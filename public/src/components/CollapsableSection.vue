<template>
  <div class="container">
    <slot name="header" />
    <div v-if="!isExpanded" class="collapsed-section">
      <slot name="collapsed" />
    </div>
    <div v-if="isExpanded" class="expanded-section">
      <slot name="expanded" />
    </div>
    <AvIconButton
      v-if="!isExpanded"
      class="edit-icon"
      black
      @icon-click="isExpanded = true"
      >edit</AvIconButton
    >
    <AvButton
      v-if="isExpanded"
      class="continue"
      @btn-click="isExpanded = false"
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

.edit-icon {
  justify-self: end;
}

.continue {
  margin-top: 2rem;
  justify-self: end;
}
</style>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';
import AvButton from './AvButton.vue';
import AvIconButton from './AvIconButton.vue';

export default createComponent({
  components: {
    AvButton,
    AvIconButton
  },
  setup() {
    const isExpanded = ref(true);

    return {
      isExpanded
    };
  }
});
</script>
