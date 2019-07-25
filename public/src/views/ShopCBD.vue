<template>
  <page-wrapper withPadding class="wrapper">
    <page-header class="header">All Products</page-header>
    <div class="products-container">
      <large-product-card v-for="product of products" :key="product.id" :product="product"></large-product-card>
    </div>
  </page-wrapper>
</template>

<style scoped>
.products-container {
  padding-right: 4vw;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 3vw;
  grid-row-gap: 6vmax;
  grid-template-columns: repeat(3, 1fr);
}

.header {
  margin-bottom: 4vmax;
}

@media (max-width: 825px) {
  .products-container {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import PageHeader from '../components/PageHeader.vue';
import LargeProductCard from '../components/LargeProductCard.vue';
import { mapState, mapActions } from 'vuex';
import WorkerFns from '../types/WorkerFns';

export default Vue.extend({
  components: {
    PageHeader,
    PageWrapper,
    LargeProductCard
  },
  computed: {
    ...mapState('base', ['products'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData'])
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
