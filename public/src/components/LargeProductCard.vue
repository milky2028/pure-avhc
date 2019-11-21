<template>
  <div class="card-container">
    <router-link :to="`/products/${product.url}`" class="img-container">
      <h2 v-if="product.disabled" class="subhead sold-out">
        {{ product.disabled }}
      </h2>
      <img :src="url" :alt="alt" :class="{ disabled: product.disabled }" />
    </router-link>
    <router-link :to="`/products/${product.url}`">
      <div>
        <h2 class="subhead larger-font">{{ product.shortName }}</h2>
        <p class="body-text tagline">{{ product.tagline }}.</p>
        <p class="body-text">Also available in:</p>
        <ul class="body-text">
          <li
            v-for="{
              price,
              measurementValue,
              measurement,
              masterMeasurement
            } in filteredSizes"
            :key="price"
          >
            {{ measurementValue }} {{ measurement
            }}{{ measurement !== 'gram' ? ` ${masterMeasurement}` : '' }}s
          </li>
        </ul>
        <h2 class="body-text size">{{ size }}</h2>
        <h3 class="body-text price">{{ price }}</h3>
      </div>
    </router-link>
    <div class="btn-container">
      <EliantoButton border-top border-bottom no-hover>
        <span class="add-or-subtract-container">
          <AvIconButton
            v-if="cartItem && cartItem.quantity > 0"
            black
            @icon-click="decrease(cartItem.id)"
            >remove_circle_outline</AvIconButton
          >
          <span class="btn-text" @click="addToCart(product)">
            {{ btnText }}
          </span>
          <AvIconButton
            v-if="cartItem && cartItem.quantity > 0"
            black
            @icon-click="addToCart(product)"
            >add_circle_outline</AvIconButton
          >
        </span>
      </EliantoButton>
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
import Size from '../types/Size';
import EliantoButton from './EliantoButton.vue';
import Product from '../types/Product';
import AvIconButton from './AvIconButton.vue';
import createRandomId from '../functions/createRandomId';
import useCart from '../use/cart';
import { createComponent, computed, reactive } from '@vue/composition-api';
import useCDNImages from '../use/cdn-image';

interface Props {
  product: Product;
}

export default createComponent<Props>({
  components: {
    EliantoButton,
    AvIconButton
  },
  props: {
    product: {
      type: Object,
      default: {}
    }
  },
  setup({ product }: Props) {
    const vh = window.innerHeight / 100;
    const { cartItems, addCartItem, updateCartItem } = useCart();

    const lowestPriceSize = product.sizes.find(
      (size: Size) =>
        size.price === Math.min(...product.sizes.map((s: Size) => s.price))
    );

    const filteredSizes = product.sizes.filter(
      (size) => size.price !== Math.min(...product.sizes.map((s) => s.price))
    );

    const price = `$${Math.min(...product.sizes.map((size) => size.price))}`;

    const cartItem = computed(() =>
      cartItems.value.find(
        (cartItem) =>
          cartItem.product === product.id &&
          cartItem.size === lowestPriceSize!.masterMeasurement &&
          cartItem.strain === 'any'
      )
    );
    const btnText = computed(() =>
      cartItem.value && cartItem.value.quantity
        ? cartItem.value.quantity
        : 'Add to Cart'
    );

    function getImageHeight() {
      const fixedHeights = 240;
      return (window.innerHeight - fixedHeights - 6 * vh) / 2;
    }

    function getImageWidth() {
      const windowWidth = window.innerWidth;
      const vw = windowWidth / 100;
      return windowWidth > 835
        ? (windowWidth - 14 * vw) / 3
        : windowWidth - 8 * vw;
    }

    const { getImage } = useCDNImages();
    const image = getImage(
      product.id,
      'allProductsImage',
      getImageHeight(),
      getImageWidth()
    );

    function addToCart(product: Product) {
      if (cartItem.value && Object.keys(cartItem.value).length > 0) {
        updateCartItem(
          {
            quantity: cartItem.value.quantity++
          },
          cartItem.value.product
        );
      } else {
        const newCartItem = {
          id: createRandomId(15),
          price: lowestPriceSize!.price,
          quantity: 1,
          product: product.id,
          size: lowestPriceSize!.masterMeasurement,
          strain: 'any'
        };
        addCartItem(newCartItem);
      }
    }

    const size = lowestPriceSize
      ? lowestPriceSize.measurement !== 'gram'
        ? `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement} ${lowestPriceSize.masterMeasurement}`
        : `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement}${
            lowestPriceSize.measurementValue > 1 ? 's' : ''
          }`
      : '';

    return {
      size,
      addToCart,
      btnText,
      filteredSizes,
      image,
      cartItem,
      addCartItem,
      vh,
      lowestPriceSize,
      price
    };
  }
});
</script>
