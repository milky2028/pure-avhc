<template>
  <transition name="fade">
    <div v-if="numberOfItemsInCart" class="badge">
      {{ numberOfItemsInCart }}
    </div>
  </transition>
</template>

<style scoped>
.badge {
  display: grid;
  align-items: center;
  justify-items: center;
  margin: -10px;
  z-index: 10;
  border-radius: 50%;
  font-size: 16px;
  background-color: var(--red);
  color: white;
  width: 20px;
  height: 20px;
  text-align: center;
  font-family: var(--mukta-malar);
  font-weight: 500;
  line-height: 0;
}
</style>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { ICart } from '../use/cart';

export default defineComponent({
  setup() {
    const { numberOfItemsInCart } = inject(Modules.cart) as ICart;
    return { numberOfItemsInCart };
  }
});
</script>
