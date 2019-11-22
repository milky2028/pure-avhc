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
import {
  createComponent,
  computed,
  watch,
  inject,
  ref
} from '@vue/composition-api';
import { Modules } from '../use/store';
import { IProducts } from '../use/products';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  },
  setup(_, { root }) {
    const { products } = inject(Modules.products) as IProducts;
    const product = computed(() =>
      products.value.find((p) => p.url === root.$route.params.productName)
    );

    const route = ref(root.$route);
    watch(route, () => {
      if (route.value.query.strain) {
        // do a thing;
      }

      if (route.value.query.size) {
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
