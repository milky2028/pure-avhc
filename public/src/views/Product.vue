<template>
  <PageWrapper with-padding>
    <ArticlePage v-if="currentPageProduct" :title="currentPageProduct.name">
      <img
        :src="selectedImage.url"
        :alt="selectedImage.alt"
        class="main-image"
      />
      <div class="gallery-container">
        <img
          v-for="image in processedImages"
          :key="image.id"
          :src="image.url"
          :alt="image.alt"
          class="gallery-img"
        />
      </div>
      <router-link to="/products/cbd-hemp-flower">
        CBD Flower
      </router-link>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped>
img {
  border-radius: var(--rounded-corner);
  object-fit: cover;
}

.main-image {
  height: 30vh;
}

.gallery-container {
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
}

.gallery-img {
  height: 60px;
  width: 100%;
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import {
  createComponent,
  computed,
  watch,
  inject,
  ref,
  reactive
} from '@vue/composition-api';
import { Modules } from '../use/store';
import { IProducts } from '../use/products';
import { IImages } from '../use/cdn-image';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  },
  setup(_, { root }) {
    const { products } = inject(Modules.products) as IProducts;
    const currentPageProduct = computed(() =>
      products.value.find((p) => p.url === root.$route.params.productName)
    );

    const { images, createUrl } = inject(Modules.images) as IImages;
    const selectedImage = reactive({ url: '', alt: '' });
    const processedImages = computed(() =>
      images.value
        .filter(
          ({ product }) =>
            currentPageProduct.value && product === currentPageProduct.value.id
        )
        .map(({ url, id, alt }) => ({
          id,
          alt,
          url: createUrl(url, 60, 100)
        }))
    );
    watch(processedImages, (newProcessedImages) => {
      selectedImage.url =
        newProcessedImages.length > 0 ? newProcessedImages[0].url : '';
      selectedImage.alt =
        newProcessedImages.length > 0 ? newProcessedImages[0].alt : '';
    });

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
      currentPageProduct,
      processedImages,
      selectedImage
    };
  }
});
</script>
