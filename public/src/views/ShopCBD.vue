<template>
  <PageWrapper with-padding class="wrapper">
    <PageHeader class="header">
      All Products
    </PageHeader>
    <div class="products-container">
      <LargeProductCard
        v-for="product of products"
        :key="product.id"
        :product="product"
      />
    </div>
  </PageWrapper>
</template>

<style scoped>
.products-container {
  padding-right: 4vw;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 3vw;
  grid-row-gap: 8vmax;
  grid-template-columns: repeat(3, 1fr);
}

.header {
  margin-bottom: 2vmax;
}

@media (max-width: 835px) {
  .products-container {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
  }
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import PageHeader from '../components/PageHeader.vue';
import LargeProductCard from '../components/LargeProductCard.vue';
import { createComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { IProducts } from '../use/products';

export default createComponent({
  components: {
    PageHeader,
    PageWrapper,
    LargeProductCard
  },
  setup() {
    const { products } = inject(Modules.products) as IProducts;
    return { products };
  }
});
</script>
