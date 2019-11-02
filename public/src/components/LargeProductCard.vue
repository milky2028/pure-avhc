<template>
  <div class="card-container">
    <router-link :to="`/products/${product.url}`" class="img-container">
      <h2 v-if="product.disabled" class="subhead sold-out">{{ product.disabled }}</h2>
      <img
        :src="getSrc(product.id)"
        :alt="getImageAlt(product.id, images)"
        :class="{ disabled: product.disabled }"
      />
    </router-link>
    <router-link :to="`/products/${product.url}`">
      <div>
        <h2 class="subhead larger-font">{{ product.shortName }}</h2>
        <p class="body-text tagline">{{ product.tagline }}.</p>
        <p class="body-text">Also available in:</p>
        <ul class="body-text">
          <li
            v-for="{ price, measurementValue, measurement, masterMeasurement } in getFilteredSizes(product.sizes)"
            :key="price"
          >{{ measurementValue }} {{ measurement }}{{ measurement !== 'gram' ? ` ${masterMeasurement}` : '' }}s</li>
        </ul>
        <h2 class="body-text size">{{ getSize(product.sizes) }}</h2>
        <h3 class="body-text price">{{ getPrice(product.sizes) }}</h3>
      </div>
    </router-link>
    <div class="btn-container">
      <elianto-button borderTop borderBottom noHover>
        <span class="add-or-subtract-container">
          <av-icon-button
            @icon-click="decrease(cartItem.id)"
            v-if="cartItem && cartItem.quantity > 0"
            black
          >remove_circle_outline</av-icon-button>
          <span @click="addToCart(product)" class="btn-text">{{ getAddBtnText(cartItem) }}</span>
          <av-icon-button
            @icon-click="addToCart(product)"
            v-if="cartItem && cartItem.quantity > 0"
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

.disabled {
  filter: blur(4px);
}

.img-container {
  display: grid;
  grid-template-areas: 'main';
  justify-content: center;
  align-items: center;
}

img {
  grid-area: main;
  object-fit: cover;
  border-radius: var(--rounded-corner);
  width: 100%;
  max-width: 100vmin;
  height: 100%;
  max-height: 40vmin;
}

.sold-out {
  grid-area: main;
  z-index: 12;
  text-align: center;
  color: white;
  background-color: black;
  padding: 16px;
  margin: 22px;
  border-radius: var(--rounded-corner);
  line-height: 1.2;
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

@media (max-width: 835px) {
  img {
    max-height: 40vmax;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import getImageUrl from '../functions/getImageUrl';
import { mapState, mapActions, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageAlt from '../functions/getImageAlt';
import Image from '../types/Image';
import Size from '../types/Size';
import EliantoButton from './EliantoButton.vue';
import AvButton from './AvButton.vue';
import CartItem from '../types/CartItem';
import Product from '../types/Product';
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';

export default Vue.extend({
  components: {
    EliantoButton,
    AvButton,
    AvIconButton
  },
  props: {
    product: Object
  },
  data() {
    return {
      cartItem: {} as CartItem
    };
  },
  computed: {
    ...mapState('base', ['imageUrl', 'images']),
    ...mapState('cart', ['cartItems'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    ...mapMutations('cart', ['addItemToCart', 'decreaseCartItemQuantity']),
    getImageAlt,
    decrease(cartItemId: string) {
      if (this.cartItem.quantity === 1) {
        this.cartItem = {} as CartItem;
      }
      this.decreaseCartItemQuantity(cartItemId);
    },
    getImageHeight() {
      const vh = window.innerHeight / 100;
      const fixedHeights = 240;
      return (window.innerHeight - fixedHeights - 6 * vh) / 2;
    },
    getImageWidth() {
      const windowWidth = window.innerWidth;
      const vw = windowWidth / 100;
      return windowWidth > 835
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
        ? lowestPriceSize.measurement !== 'gram'
          ? `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement} ${lowestPriceSize.masterMeasurement}`
          : `${lowestPriceSize.measurementValue} ${
              lowestPriceSize.measurement
            }${lowestPriceSize.measurementValue > 1 ? 's' : ''}`
        : '';
    },
    getFilteredSizes(sizes: Size[]) {
      return sizes.filter(
        (size) => size.price !== Math.min(...sizes.map((s) => s.price))
      );
    },
    addToCart(product: Product) {
      const lowestPriceSize = product.sizes.find(
        (size) => size.price === Math.min(...product.sizes.map((s) => s.price))
      ) as Size;

      if (Object.keys(this.cartItem).length > 0) {
        this.addItemToCart(this.cartItem);
      } else {
        this.cartItem = {
          id: createRandomId(15),
          price: lowestPriceSize.price,
          quantity: 1,
          product: product.id,
          size: lowestPriceSize.masterMeasurement,
          strain: 'any'
        } as CartItem;
        this.addItemToCart(this.cartItem);
      }
    },
    getProductInCart(productId: string, sizeValue: string) {
      return this.cartItems.find(
        ({ size, product }: CartItem) =>
          product === productId && size === sizeValue
      );
    },
    getAddBtnText(cartItem: CartItem) {
      return cartItem && cartItem.quantity ? cartItem.quantity : 'Add to Cart';
    }
  },
  mounted() {
    const lowestPriceSize = this.product.sizes.find(
      (size: Size) =>
        size.price === Math.min(...this.product.sizes.map((s: Size) => s.price))
    );
    const productInCart = this.getProductInCart(
      this.product.id,
      lowestPriceSize.masterMeasurement
    );

    this.cartItem = productInCart ? productInCart : {};

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

