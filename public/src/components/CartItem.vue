<template>
  <div class="container">
    <img
      v-if="product && products"
      :src="getSrc(product.id, imageUrl, images)"
      :alt="getImageAlt(product.id, images)"
    />
    <div class="info-container">
      <router-link v-if="product && product.name" :to="`/products/${product.url}`">
        <h2 class="body-text header">{{ product.name }}</h2>
      </router-link>
      <div class="select-container">
        <small-selector
          label="Qty"
          :selectValue="String(cartItem.quantity)"
          :options="options"
          @select-changed="
            updateCartItem({
              cartItemId: cartItem.id,
              newCartItem: {
                quantity: +$event
              }
            })
          "
        ></small-selector>
        <small-selector
          label="Size"
          v-if="product && product.sizes"
          :selectValue="String(cartItem.size)"
          :options="product.sizes"
          diffKey="id"
          displayKey="display"
          valueKey="masterMeasurement"
          :displayValueHandler="
            product.pluralizeSizes ? this.getDisplayValue : null
          "
          @select-changed="onSizeChange($event)"
        ></small-selector>
        <small-selector
          label="Strain"
          v-if="strains && strains.length > 0"
          :selectValue="String(cartItem.strain)"
          :options="strains.slice().sort(sortByStrain)"
          diffKey="id"
          displayKey="name"
          valueKey="type"
          @select-changed="
            updateCartItem({
              cartItemId: cartItem.id,
              newCartItem: {
                strain: $event
              }
            })
          "
        ></small-selector>
      </div>
      <av-icon-button
        class="remover-icon"
        black
        @icon-click="removeItemFromCart(cartItem.id)"
      >remove_circle_outline</av-icon-button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2vh 0;
  display: grid;
  grid-template-columns: 100px 1fr;
}

.header {
  color: var(--dark-accent);
  font-weight: 600;
  font-size: 18px;
}

.info-container {
  display: grid;
  padding: 5px 0 5px 12px;
  grid-template-columns: 1fr 32px;
  grid-template-rows: 3rem 1fr;
  column-gap: 8px;
  grid-template-areas:
    'product-name icon'
    'selectors icon';
}

img {
  height: 80px;
  width: 100px;
  object-fit: cover;
  border-radius: var(--rounded-corner);
}

.select-container {
  grid-area: selectors;
  margin-top: 6px;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 4fr 7fr 6fr;
  column-gap: 6px;
  align-items: center;
}

.qty {
  margin-left: 22px;
}

.remover-icon {
  grid-area: icon;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Image from '../types/Image';
import getImageUrl from '../functions/getImageUrl';
import getImageAlt from '../functions/getImageAlt';
import { mapState, mapMutations } from 'vuex';
import Product from '../types/Product';
import SmallSelector from '../components/SmallSelector.vue';
import AvIconButton from '../components/AvIconButton.vue';
import Size from '../types/Size';
import Strain from '../types/Strain';

export default Vue.extend({
  components: {
    SmallSelector,
    AvIconButton
  },
  props: {
    cartItem: Object,
    strains: Array
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
    ...mapMutations('cart', [
      'setCartItemQuantity',
      'updateCartItem',
      'removeItemFromCart'
    ]),
    getImageAlt,
    getSrc(id: string, imageUrl: string, images: Image[]): string {
      const image = images.find(
        (i: Image) => i.product === id && i.toolbarImage
      );
      return getImageUrl(imageUrl, image ? image.url : '', 80, 100);
    },
    sortByStrain(a: Strain, b: Strain) {
      return a.name > b.name ? 1 : -1;
    },
    getDisplayValue(value: string) {
      return `${value}${this.cartItem.quantity > 1 ? 's' : ''}`;
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
