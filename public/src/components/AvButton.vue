<template>
  <button @click="onClick" :style="getStyles()">
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
    longBtn: Boolean,
    icon: String
  },
  methods: {
    onClick(e: Event) {
      const target = e.target as HTMLButtonElement;
      this.$emit('btn-click', e);
    },
    getStyles() {
      return {
        ...(this.longBtn ? { padding: '6px 60px' } : {}),
        ...(this.fullWidth ? { width: '100%', justifyContent: 'center' } : {})
      };
    }
  }
});
</script>


