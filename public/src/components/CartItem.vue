<template>
  <div>{{ product.name }}</div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  props: {
    cartItem: Object
  },
  computed: {
    ...mapState('base', ['products']),
    product() {
      return this.products.find(
        (product) => product.id === this.cartItem.product
      );
    }
  }
});
</script>