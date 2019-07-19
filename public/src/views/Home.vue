<template>
  <page-wrapper>
    <div class="home">
      <div
        v-for="product in products.filter(p => p.featuredOnHome)"
        :key="product.name"
        class="image"
        :class="(product.sortOrder === 0) ? 'main' : (product.sortOrder === 1) ? 'side1' : 'side2'"
        :style="{ backgroundImage: `url(${getImageUrl(imageUrl, product.mainImage, getImageHeight(product.sortOrder))})` }"
      ></div>
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
  background-size: contain;
  background-repeat: no-repeat;
}

.main {
  grid-area: main;
}

@media (max-width: 825px) {
  .home {
    height: calc(200vh - 55px);
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr 1fr;
    grid-template-areas:
      'main'
      'side1'
      'side2';
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import { mapState, mapActions } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageUrl from '../actors/getImageUrl';

export default Vue.extend({
  components: {
    PageWrapper
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
        : (windowHeight - navHeight) / 2;
    }
  },
  beforeMount() {
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
