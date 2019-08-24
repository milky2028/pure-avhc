<template>
  <div class="card-container">
    <router-link :to="`products/${product.url}`">
      <img :src="getSrc(product.id)" :alt="getImageAlt(product.id, images)" />
    </router-link>
    <router-link :to="`products/${product.url}`">
      <div>
        <h2 class="subhead larger-font">{{ product.shortName }}</h2>
        <p class="body-text tagline">{{ product.tagline }}.</p>
        <p class="body-text">Also available in:</p>
        <ul class="body-text">
          <li
            v-for="{ price, measurementValue, measurement, masterMeasurement } in getFilteredSizes(product.sizes)"
            :key="price"
          >{{ measurementValue }} {{ measurement }} {{ masterMeasurement }}s</li>
        </ul>
        <h2 class="body-text size">{{ getSize(product.sizes) }}</h2>
        <h3 class="body-text price">{{ getPrice(product.sizes) }}</h3>
      </div>
    </router-link>
    <div class="btn-container">
      <elianto-button borderTop borderBottom noHover>
        <span class="add-or-subtract-container">
          <av-icon-button
            @icon-click="decreaseCartItemQuantity(product.id)"
            v-if="getProductInCart(product.id) && getProductInCart(product.id).quantity > 0"
            black
          >remove_circle_outline</av-icon-button>
          <span @click="addToCart(product.sizes)" class="btn-text">{{ getAddBtnText() }}</span>
          <av-icon-button
            @icon-click="addToCart(product.sizes)"
            v-if="getProductInCart(product.id) && getProductInCart(product.id).quantity > 0"
            black
          >add_circle_outline</av-icon-button>
        </span>
      </elianto-button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 3fr 1fr 65px;
  grid-row-gap: 2vh;
  max-height: calc(90vh - 102px - 3vmax);
  min-height: 450px;
}

img {
  object-fit: cover;
  border-radius: var(--rounded-corner);
  width: 100%;
  max-width: 100vmin;
  height: 100%;
}

.larger-font {
  font-weight: 600;
  line-height: 1.2;
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-accent);
}

.tagline {
  padding-bottom: 6px;
  font-size: 20px;
}

.size {
  font-size: 18px;
  font-weight: 700;
}

.other-sizes {
  font-weight: 700;
  color: var(--dark-accent);
}

.price {
  font-weight: 600;
  color: var(--dark-accent);
  font-size: 28px;
  line-height: 1;
}

ul {
  font-family: var(--mukta-malar);
  font-weight: 700;
  list-style: disc;
  padding: 5px 0 12px 24px;
  color: var(--dark-accent);
}

.add-or-subtract-container {
  display: flex;
  align-content: center;
  justify-content: space-around;
}

.btn-text {
  display: block;
}
</style>

<script lang="ts">
import Vue from 'vue';
import getImageUrl from '../actors/getImageUrl';
import createRandomId from '../actors/createRandomId';
import { mapState, mapActions, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageAlt from '../actors/getImageAlt';
import Image from '../types/Image';
import Size from '../types/Size';
import EliantoButton from '../components/EliantoButton.vue';
import AvButton from '../components/AvButton.vue';
import CartItem from '../types/CartItem';
import Product from '../types/Product';
import AvIconButton from '../components/AvIconButton.vue';

export default Vue.extend({
  components: {
    EliantoButton,
    AvButton,
    AvIconButton
  },
  props: {
    product: Object
  },
  computed: {
    ...mapState('base', ['imageUrl', 'images']),
    ...mapState('cart', ['cartItems'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    ...mapMutations('cart', ['addItemToCart', 'decreaseCartItemQuantity']),
    getImageAlt,
    getImageHeight() {
      const vh = window.innerHeight / 100;
      const fixedHeights = 240;
      return (window.innerHeight - fixedHeights - 6 * vh) / 2;
    },
    getImageWidth() {
      const windowWidth = window.innerWidth;
      const vw = windowWidth / 100;
      return windowWidth > 825
        ? (windowWidth - 14 * vw) / 3
        : windowWidth - 8 * vw;
    },
    getSrc(id: string) {
      const image = this.images.find(
        (i: Image) => i.product === id && i.allProductsImage
      );
      return getImageUrl(
        this.imageUrl,
        image ? image.url : '',
        this.getImageHeight(),
        this.getImageWidth()
      );
    },
    getPrice(sizes: Size[]) {
      const prices = sizes.map((size) => size.price);
      return `$${Math.min(...prices)}`;
    },
    getSize(sizes: Size[]) {
      const lowestPriceSize = sizes.find(
        (size) => size.price === Math.min(...sizes.map((s) => s.price))
      );

      return lowestPriceSize
        ? `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement} ${lowestPriceSize.masterMeasurement}`
        : '';
    },
    getFilteredSizes(sizes: Size[]) {
      return sizes.filter(
        (size) => size.price !== Math.min(...sizes.map((s) => s.price))
      );
    },
    addToCart(sizes: Size[]) {
      const lowestPriceSize = sizes.find(
        (size) => size.price === Math.min(...sizes.map((s) => s.price))
      );

      const item: CartItem = {
        price: lowestPriceSize!.price,
        quantity: 1,
        product: this.product.id,
        size: lowestPriceSize!.masterMeasurement,
        strain: ''
      };
      this.addItemToCart(item);
    },
    getProductInCart(id: string) {
      return this.cartItems.find(
        ({ product }: CartItem) => product === this.product.id
      );
    },
    getAddBtnText() {
      const productInCart = this.getProductInCart(this.product.id);
      return productInCart && productInCart.quantity
        ? productInCart.quantity
        : 'Add to Cart';
    }
  },
  beforeMount() {
    if (this.images.length < 1) {
      const imagesOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'images'
      };
      this.getFirestoreData(imagesOptions);
    }
  }
});
</script>

