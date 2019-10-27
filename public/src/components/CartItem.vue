<template>
  <div>
    <img
      v-if="product && products"
      :src="getSrc(product.id, imageUrl, images)"
      :alt="getImageAlt(product.id, images)"
    />
  </div>
</template>

<style scoped>
img {
  height: 80px;
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
      return getImageUrl(imageUrl, image ? image.url : '', 100);
    }
  },
  mounted() {
    this.product = this.products.find(
      (product: Product) => product.id === this.cartItem.product
    );
  }
});
</script>