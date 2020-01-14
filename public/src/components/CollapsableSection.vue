<template>
  <div class="container">
    <slot name="header" />
    <div v-if="!isExpanded" class="collapsed-section">
      <slot name="collapsed" />
    </div>
    <div v-if="isExpanded" class="expanded-section">
      <slot name="expanded" />
    </div>
    <AvButton v-if="showButton" long @btn-click="$emit('next', $event)">
      Continue
    </AvButton>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api';
import AvButton from './AvButton.vue';

interface Props {
  isExpanded: boolean;
  showButton: boolean;
}

export default createComponent<Props>({
  components: {
    AvButton
  },
  props: {
    isExpanded: {
      type: Boolean,
      default: true
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props: Props) {
    const isExpanded = computed(() => props.isExpanded);

    return {
      isExpanded
    };
  }
});
</script>
