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
    <AddToCartButton :product="product" :size="lowestPriceSize" />
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

@media (max-width: 835px) {
  img {
    max-height: 40vmax;
  }
}
</style>

<script lang="ts">
import Size from '../types/Size';
import Product from '../types/Product';
import AddToCartButton from './AddToCartButton.vue';
import { createComponent, inject, ref } from '@vue/composition-api';
import { Modules } from '../use/store';
import { IImages } from '../use/cdn-image';

interface Props {
  product: Product;
}

export default createComponent<Props>({
  components: {
    AddToCartButton
  },
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  setup({ product }: Props) {
    const lowestPriceSize = product.sizes.find(
      (size: Size) =>
        size.price === Math.min(...product.sizes.map((s: Size) => s.price))
    );

    const filteredSizes = product.sizes.filter(
      (size) => size.price !== Math.min(...product.sizes.map((s) => s.price))
    );

    const price = `$${Math.min(...product.sizes.map((size) => size.price))}`;

    const size = lowestPriceSize
      ? lowestPriceSize.measurement !== 'gram'
        ? `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement} ${lowestPriceSize.masterMeasurement}`
        : `${lowestPriceSize.measurementValue} ${lowestPriceSize.measurement}${
            lowestPriceSize.measurementValue > 1 ? 's' : ''
          }`
      : '';

    const { getImage } = inject(Modules.images) as IImages;
    const vh = window.innerHeight / 100;
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

    const url = ref('');
    const alt = ref('');
    const imageRes = getImage(
      product.id,
      'allProductsImage',
      getImageHeight(),
      getImageWidth()
    );
    if (imageRes) {
      url.value = imageRes.url;
      alt.value = imageRes.alt;
    }

    return {
      size,
      filteredSizes,
      alt,
      url,
      vh,
      lowestPriceSize,
      price
    };
  }
});
</script>
