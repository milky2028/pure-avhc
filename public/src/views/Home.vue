<template>
  <page-wrapper>
    <div class="home">
      <div
        v-for="product in products.filter(p => p.featuredOnHome)"
        :key="product.name"
        class="image"
        :class="(product.sortOrder === 0) ? 'main' : (product.sortOrder === 1) ? 'side1' : 'side2'"
        :style="{ backgroundImage: `url(${getImageUrl(imageUrl, product.mainImage, getImageHeight(product.sortOrder))})` }"
      >
        <div class="tagline-container">
          <h1 class="subhead larger-font">{{ product.tagline }}</h1>
          <h2 class="body-text subtag">{{ product.subtag }}</h2>
        </div>
        <av-button
          longBtn
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
}

.main {
  grid-area: main;
  display: grid;
  padding: 4vw;
}

.btn {
  align-self: end;
  justify-self: end;
}

.tagline-container {
  justify-self: end;
}

.larger-font {
  font-weight: 600;
  font-size: 26px;
}

.subtag {
  margin-block-end: 0;
  margin-top: 10px;
  text-align: right;
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
    ...mapState('base', ['products', 'imageUrl'])
  },
  methods: {
    getImageUrl,
    ...mapActions('base', ['getFirestoreData']),
    getImageHeight(sortOrder: number): number {
      const navHeight = 55;
      const windowHeight = window.innerHeight;
      return sortOrder === 0
        ? windowHeight - navHeight
        : Math.round((windowHeight - navHeight) / 2);
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
  }
});
</script>
