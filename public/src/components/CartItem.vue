<template>
  <div class="container">
    <img
      v-if="product && products"
      :src="getSrc(product.id, imageUrl, images)"
      :alt="getImageAlt(product.id, images)"
    />
    <div class="info-container">
      <h2 v-if="product && product.name" class="body-text header">{{ product.name }}</h2>
      <!-- <p class="body-text">{{ `${cartItem.size}${cartItem.quantity > 1 ? 's' : ''}` }}</p> -->
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 100px 1fr;
}

.header {
  color: var(--dark-accent);
  font-weight: 600;
}

.info-container {
  padding: 5px 12px;
}

img {
  height: 80px;
  width: 100px;
  object-fit: cover;
  border-radius: var(--rounded-corner);
}
</style>

<script lang="ts">
import Vue from 'vue';
import Image from '../types/Image';
import getImageUrl from '../functions/getImageUrl';
import getImageAlt from '../functions/getImageAlt';
import { mapState } from 'vuex';
import Product from '../types/Product';

export default Vue.extend({
  props: {
    cartItem: Object
  },
  data() {
    return {
      product: {}
    };
  },
  watch: {
    products(products: Product[]) {
      this.product = products.find(
        (product: Product) => product.id === this.cartItem.product
      ) as Product;
    }
  },
  computed: {
    ...mapState('base', ['products', 'images', 'imageUrl'])
  },
  methods: {
    getImageAlt,
    getSrc(id: string, imageUrl: string, images: Image[]): string {
      const image = images.find(
        (i: Image) => i.product === id && i.toolbarImage
      );
      return getImageUrl(imageUrl, image ? image.url : '', 80, 100);
    }
  },
  mounted() {
    this.product = this.products.find(
      (product: Product) => product.id === this.cartItem.product
    );
  }
});
</script>