<template>
  <transition name="fade">
    <div
      v-if="totalItemsInCart"
      class="badge"
    >
      {{ totalItemsInCart }}
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
  background-color: var(--warn);
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
import { mapGetters } from 'vuex';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  computed: {
    ...mapGetters('cart', ['totalItemsInCart'])
  }
});
</script>
