<template>
  <page-wrapper>
    <div class="home">
      <div
        v-for="product in products.filter(p => p.featuredOnHome)"
        :key="product.name"
        class="image"
        :class="(product.sortOrder === 0) ? 'main' : (product.sortOrder === 1) ? 'side1' : 'side2'"
        :style="getBackground(product)"
      >
        <div class="tagline-container">
          <h1 class="subhead larger-font">{{ product.tagline }}</h1>
          <h2 class="body-text subtag">{{ product.subtag }}</h2>
          <av-button
            v-if="product.sortOrder !== 0 || windowWidth > 825"
            flat
            class="cart-btn"
          >{{ product.sortOrder === 0 ? 'Add to Cart' : 'Shop' }} ></av-button>
        </div>
        <av-button
          long
          :fullWidth="windowWidth < 825"
          class="btn"
          @btn-click="$router.push('/shop')"
          v-if="product.sortOrder === 0"
        >Shop Now</av-button>
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
  padding: 2vw;
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
import { mapState, mapActions } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageUrl from '../actors/getImageUrl';
import AvButton from '../components/AvButton.vue';

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
    getImageHeight(sortOrder: number): number {
      const navHeight = 55;
      const windowHeight = window.innerHeight;
      return sortOrder === 0
        ? windowHeight - navHeight
        : (windowHeight - navHeight) / 2;
    },
    getUrlEnding(id: string) {
      const image = this.images.find((i) => i.product === id && i.mainImage);
      return image ? image.url : '';
    },
    getBackground({ id, sortOrder }: { id: string; sortOrder: number }) {
      return {
        backgroundImage: `${
          this.windowWidth < 825
            ? 'linear-gradient(180deg, #ffffff 10%, rgba(255, 255, 255, 0) 70%), '
            : ''
        }url(${getImageUrl(
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
