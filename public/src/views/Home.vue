<template>
  <PageWrapper>
    <div class="home">
      <div
        v-for="product in products.filter((p) => p.featuredOnHome)"
        :key="product.name"
        class="image"
        :class="{
          main: product.sortOrder === 0,
          side1: product.sortOrder === 1,
          side2: product.sortOrder > 1
        }"
        :style="getBackground(product.id)"
        :name="getAlt(product.id)"
      >
        <div class="tagline-container">
          <h1 class="subhead larger-font">
            {{ product.tagline }}
          </h1>
          <h2 class="body-text subtag">
            <span>{{ product.subtag }}</span>
          </h2>
          <AvButton
            flat
            class="cart-btn"
            @btn-click="$router.push(`/products/${product.url}`)"
          >
            Shop {{ getLastWord(product) }} >
          </AvButton>
        </div>
        <AvButton
          v-if="product.sortOrder === 0"
          long
          :full-width="windowWidth < 835"
          class="btn"
          @btn-click="$router.push('/shop-cbd')"
        >
          Shop All Products
        </AvButton>
      </div>
    </div>
  </PageWrapper>
</template>

<style scoped>
.home {
  height: calc(100vh - 55px);
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    'main side1'
    'main side2';
}

.image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  padding: 2vh;
}

.main {
  grid-area: main;
  display: grid;
}

.btn {
  margin-bottom: 8vh;
  margin-right: 3vw;
  align-self: end;
  justify-self: end;
}

.tagline-container {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.larger-font {
  font-weight: 600;
  text-align: right;
  line-height: 1.2;
}

.subtag {
  background-color: var(--primary-color);
  color: white;
  margin-block-end: 0;
  margin-top: 5px;
  text-align: right;
  padding: 0 5px;
  line-height: inherit;
  border-radius: var(--rounded-corner);
}

.cart-btn {
  margin-top: 5px;
}

@media (max-width: 835px) {
  .home {
    height: calc(200vh - 110px);
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr 1fr;
    grid-template-areas:
      'main'
      'side1'
      'side2';
  }

  .btn {
    margin-bottom: 10vh;
    margin-right: 0;
    justify-self: center;
  }

  .larger-font {
    text-align: center;
    line-height: 1.2;
  }

  .subtag {
    text-align: center;
  }

  .tagline-container {
    justify-self: center;
    align-items: center;
  }
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import AvButton from '../components/AvButton.vue';
import Product from '../types/Product';
import useWindowWith from '../use/window-width';
import useCDNImages from '../use/cdn-image';
import useProducts from '../use/products';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  components: {
    PageWrapper,
    AvButton
  },
  setup() {
    const { windowWidth } = useWindowWith();
    const { products } = useProducts();

    function getLastWord(product: Product) {
      const words = product.name.split(' ');
      return words[words.length - 1];
    }

    const { getImage } = useCDNImages();

    function getImageHeight(sortOrder: number): number {
      const navHeight = 55;
      const windowHeight = window.innerHeight;
      return sortOrder === 0
        ? windowHeight - navHeight
        : (windowHeight - navHeight) / 2;
    }

    const images = products.value.map(async ({ id, sortOrder }) => ({
      id,
      ...(await getImage(
        id,
        'mainImage',
        getImageHeight(sortOrder),
        undefined,
        true
      ))
    }));

    async function getAlt(productId: string) {
      const resolvedImages = await Promise.all(images);
      const image = resolvedImages.find(({ id }) => id === productId) as {
        url: string;
        alt: string;
        id: string;
      };
      return image && image.alt ? image.alt : '';
    }

    async function getBackground(productId: string) {
      const resolvedImages = await Promise.all(images);
      const url = resolvedImages.find(({ id }) => id === productId);
      return {
        backgroundImage: `linear-gradient(180deg, #ffffff 10%, rgba(255, 255, 255, 0) 70%), ${url}`
      };
    }

    return {
      windowWidth,
      getBackground,
      getAlt,
      getLastWord
    };
  }
});
</script>
