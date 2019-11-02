<template>
  <div class="container">
    <img
      v-if="product && products"
      :src="getSrc(product.id, imageUrl, images)"
      :alt="getImageAlt(product.id, images)"
    />
    <div class="info-container">
      <h2 v-if="product && product.name" class="body-text header">
        {{ product.name }}
      </h2>
      <div class="select-container">
        <small-selector
          :selectValue="String(cartItem.quantity)"
          :options="options"
          @select-changed="
            setCartItemQuantity({ quantity: +$event, cartItemId: cartItem.id })
          "
        ></small-selector>
        <small-selector
          v-if="product"
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
          v-if="strains && strains.length > 0"
          :selectValue="String(cartItem.strain)"
          :options="strains"
          diffKey="id"
          displayKey="name"
          valueKey="type"
          @select-changed="onStrainChange($event)"
        ></small-selector>
      </div>
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
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  align-items: center;
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
import SmallSelector from '../components/SmallSelector.vue';
import Size from '../types/Size';

export default Vue.extend({
  components: {
    SmallSelector
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
    ...mapMutations('cart', ['setCartItemQuantity', 'updateCartItem']),
    getImageAlt,
    getSrc(id: string, imageUrl: string, images: Image[]): string {
      const image = images.find(
        (i: Image) => i.product === id && i.toolbarImage
      );
      return getImageUrl(imageUrl, image ? image.url : '', 80, 100);
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
    },
    onStrainChange(newStrain: string) {
      this.updateCartItem({
        cartItemId: this.cartItem.id,
        newCartItem: {
          strain: newStrain
        }
      });
    }
  },
  mounted() {
    this.product = this.products.find(
      ({ id }: Product) => id === this.cartItem.product
    );
  }
});
</script>
