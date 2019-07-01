<template>
  <button @click="onClick">
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
  cursor: pointer;
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 5px;
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
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
    icon: String
  },
  methods: {
    onClick(e: Event) {
      const target = e.target as HTMLButtonElement;
      this.$emit('icon-click', e);
    }
  }
});
</script>


