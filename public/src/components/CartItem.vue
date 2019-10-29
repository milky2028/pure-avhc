<template>
  <div class="container">
    <img
      v-if="product && products"
      :src="getSrc(product.id, imageUrl, images)"
      :alt="getImageAlt(product.id, images)"
    />
    <div class="info-container">
      <h2 v-if="product && product.name" class="body-text header">{{ product.name }}</h2>
      <div class="select-container">
        <div class="selector">
          <select
            :value="cartItem.quantity"
            @change="setCartItemQuantity({ quantity: +$event.target.value, cartItemId: cartItem.id })"
          >
            <option v-for="option of options" :key="option">{{ option }}</option>
          </select>
          <av-icon-button
            :style="{ marginLeft: `${String(cartItem.quantity).length / 2}ch` }"
            class="icon-btn"
            black
          >expand_more</av-icon-button>
        </div>
        <div class="selector" v-if="product">
          <select :value="cartItem.size" @change="onSizeChange($event.target.value)">
            <option
              v-for="{ masterMeasurement, id } of product.sizes"
              :key="id"
              :value="masterMeasurement"
            >{{ `${masterMeasurement}${cartItem.quantity > 1 ? 's' : ''}` }}</option>
          </select>
          <av-icon-button
            :style="{ marginLeft: `${String(cartItem.size).length / 2}ch` }"
            class="icon-btn"
            black
          >expand_more</av-icon-button>
        </div>
      </div>
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
  font-size: 18px;
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

.select-container {
  margin-top: 6px;
  width: 50px;
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  align-items: center;
}

.selector {
  display: grid;
  grid-auto-flow: column;
  grid-template-areas: 'main';
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  grid-area: main;
  padding: 2px;
  border-radius: 0;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  z-index: 10;
}

.icon-btn {
  grid-area: main;
  justify-self: end;
}

.qty {
  margin-left: 22px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Image from '../types/Image';
import getImageUrl from '../functions/getImageUrl';
import getImageAlt from '../functions/getImageAlt';
import { mapState, mapMutations } from 'vuex';
import Product from '../types/Product';
import AvIconButton from '../components/AvIconButton.vue';
import Size from '../types/Size';

export default Vue.extend({
  components: {
    AvIconButton
  },
  props: {
    cartItem: Object
  },
  data() {
    return {
      product: {} as Product,
      options: [...Array(100).keys()]
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
    ...mapMutations('cart', ['setCartItemQuantity', 'updateCartItem']),
    getImageAlt,
    getSrc(id: string, imageUrl: string, images: Image[]): string {
      const image = images.find(
        (i: Image) => i.product === id && i.toolbarImage
      );
      return getImageUrl(imageUrl, image ? image.url : '', 80, 100);
    },
    onSizeChange(newSize: string) {
      const newItemSize = this.product.sizes.find(
        ({ masterMeasurement }) => masterMeasurement === newSize
      ) as Size;

      if (newItemSize) {
        this.updateCartItem({
          cartItemId: this.cartItem.id,
          newCartItem: {
            price: newItemSize.price,
            size: newSize
          }
        });
      }
    }
  },
  mounted() {
    this.product = this.products.find(
      ({ id }: Product) => id === this.cartItem.product
    );
  }
});
</script>