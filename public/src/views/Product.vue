<template>
  <PageWrapper with-padding>
    <ArticlePage
      v-if="product"
      :title="product.name"
    >
      <p>{{ product.name }}</p>
      <router-link to="/products/cbd-hemp-flower">
        CBD Flower
      </router-link>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import WorkerFns from '../types/WorkerFns';
import { mapActions, mapState } from 'vuex';
import Product from '../types/Product';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage
  },
  data() {
    return {
      product: {} as Product | undefined,
      windowWidth: window.innerWidth
    };
  },
  watch: {
    products(products: Product[]) {
      this.product = products.find(
        (p: Product) => p.url === this.$route.params.productName
      );
    },
    $route(to) {
      this.product = this.products.find(
        (p: Product) => p.url === to.params.productName
      );

      if (to.query.strain) {
        // do a thing;
      }

      if (to.query.size) {
        // do a thing
      }
    }
  },
  computed: {
    ...mapState('base', ['products'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData'])
  },
  mounted() {
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

    this.product = this.products.find(
      (p: Product) => p.url === this.$route.params.productName
    );
  }
});
</script>