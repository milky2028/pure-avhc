<template>
  <PageWrapper with-padding class="wrapper">
    <PageHeader class="header">All Products</PageHeader>
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
import { defineComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { IProducts } from '../use/products';
import { useMetadata } from '../use/metadata';
import useStructuredData from '../use/structured-data';
import { IImages } from '../use/cdn-image';

export default defineComponent({
  components: {
    PageHeader,
    PageWrapper,
    LargeProductCard
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Shop CBD');
    setPageDescription(
      'Shop a variety of CBD products, from our acclaimed CBD Cigarrettes, to CBD Joints/Pre-rolls, to jars of CBD Flower. Experience CBD the way it was meant to be. Shop now.'
    );

    const { products } = inject(Modules.products) as IProducts;
    const {
      setStructuredData,
      createProductStructuredData
    } = useStructuredData();
    const { images, createUrl } = inject(Modules.images) as IImages;
    products.value.forEach((p) => {
      const mainImage = images.value.find(({ product }) => product === p.id);
      const lowestPriceSize = p.sizes.find(
        (size) => size.price === Math.min(...p.sizes.map(({ price }) => price))
      );
      if (mainImage && lowestPriceSize) {
        const url = createUrl(mainImage.url, 400, 300, false, true);
        setStructuredData(createProductStructuredData(p, url, lowestPriceSize));
      }
    });
    return { products };
  }
});
</script>
