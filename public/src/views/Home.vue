<template>
  <page-wrapper>
    <div class="home">
      <div
        v-for="product in products.filter(p => p.featuredOnHome)"
        :key="product.name"
        class="image"
        :class="(product.sortOrder === 0) ? 'main' : (product.sortOrder === 1) ? 'side1' : 'side2'"
        :style="getBackground(product)"
        :name="getImageAlt(product.id, images)"
      >
        <div class="tagline-container">
          <h1 class="subhead larger-font">{{ product.tagline }}</h1>
          <h2 class="body-text subtag">
            <span>{{ product.subtag }}</span>
          </h2>
          <av-button
            v-if="product.sortOrder !== 0 || windowWidth > 825"
            flat
            class="cart-btn"
            @btn-click="$router.push(`/products/${product.url}`)"
          >Shop ></av-button>
        </div>
        <av-button
          long
          :fullWidth="windowWidth < 825"
          class="btn"
          @btn-click="$router.push('/shop-cbd')"
          v-if="product.sortOrder === 0"
        >Shop All Products</av-button>
      </div>
    </div>
  </page-wrapper>
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
  font-size: 26px;
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
}

.cart-btn {
  margin-top: 5px;
}

@media (max-width: 825px) {
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
    justify-self: center;
  }

  .larger-font {
    font-size: 28px;
    text-align: center;
    line-height: 1.2;
  }

  .subtag {
    text-align: center;
  }

  .tagline-container {
    align-items: center;
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageUrl from '../actors/getImageUrl';
import getImageAlt from '../actors/getImageAlt';
import AvButton from '../components/AvButton.vue';
import Image from '../types/Image';
import Size from '../types/Size';
import CartItem from '../types/CartItem';
import Product from '../types/Product';

export default Vue.extend({
  components: {
    PageWrapper,
    AvButton
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('base', ['products', 'imageUrl', 'images'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    ...mapMutations('cart', ['addItemToCart']),
    getImageAlt,
    getImageHeight(sortOrder: number): number {
      const navHeight = 55;
      const windowHeight = window.innerHeight;
      return sortOrder === 0
        ? windowHeight - navHeight
        : (windowHeight - navHeight) / 2;
    },
    getUrlEnding(id: string) {
      const image = this.images.find(
        (i: Image) => i.product === id && i.mainImage
      );
      return image ? image.url : '';
    },
    getBackground({ id, sortOrder }: { id: string; sortOrder: number }) {
      return {
        backgroundImage: `linear-gradient(180deg, #ffffff 10%, rgba(255, 255, 255, 0) 70%), url(${getImageUrl(
          this.imageUrl,
          this.getUrlEnding(id),
          this.getImageHeight(sortOrder)
        )})`
      };
    }
  },
  beforeMount() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );

    if (this.products.length < 1) {
      const productsOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'products'
      };
      this.getFirestoreData(productsOptions);
    }

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
