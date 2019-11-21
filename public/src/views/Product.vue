<template>
  <PageWrapper with-padding>
    <ArticlePage v-if="product" :title="product.name">
      <p>{{ product.name }}</p>
      <router-link to="/products/cbd-hemp-flower">
        CBD Flower
      </router-link>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped></style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import useProducts from '../use/products';
import { createComponent, computed } from '@vue/composition-api';
import { watch } from 'fs';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  },
  setup(_, { root }) {
    const { products } = useProducts();
    const product = computed(() =>
      products.value.find((p) => p.url === root.$route.params.productName)
    );

    const route = root.$route;
    watch(route.path, () => {
      if (route.query.strain) {
        // do a thing;
      }

      if (route.query.size) {
        // do a thing
      }
    });

    return {
      product,
      windowWidth: window.innerWidth
    };
  }
});
</script>
