<template>
  <PageWrapper with-padding>
    <ArticlePage v-if="currentPageProduct" :title="currentPageProduct.name">
      <img
        :src="createUrl(selectedImage.url, getImageHeight())"
        :alt="selectedImage.alt"
        class="main-image"
      />
      <div class="gallery-container">
        <img
          v-for="image in processedImages"
          :key="image.id"
          tabindex="0"
          :src="createUrl(image.url, 60, 100)"
          :alt="image.alt"
          class="gallery-img"
          :class="{ selectedGalleryImage: selectedImage.url === image.url }"
          @click="
            selectedImage.url = image.url;
            selectedImage.alt = image.alt;
          "
        />
      </div>
      <AvSelector
        label="Product"
        :options="products"
        loop-key="id"
        display-key="name"
        value-key="url"
        :bound-prop="selectedProduct"
        @select-change="onChange($event)"
      />
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
  width: 100%;
}

.main-image {
  margin: 2rem 0;
  height: 30vh;
}

.gallery-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 1rem;
}

.gallery-img {
  height: 60px;
  transition: box-shadow 50ms var(--mat-ease);
}

.selectedGalleryImage {
  border: 2px solid var(--dark-accent);
  box-shadow: var(--basic-shadow);
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvSelector from '../components/AvSelector.vue';
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
    ArticlePage,
    AvSelector
  },
  setup(_, { root }) {
    const { products } = inject(Modules.products) as IProducts;
    const currentPageProduct = computed(() =>
      products.value.find((p) => p.url === root.$route.params.productName)
    );

    const { images, createUrl } = inject(Modules.images) as IImages;
    const selectedImage = reactive({ url: '', alt: '' });
    const processedImages = computed(() =>
      images.value.filter(
        ({ product }) =>
          currentPageProduct.value && product === currentPageProduct.value.id
      )
    );
    watch(processedImages, (newProcessedImages) => {
      const mainImage = newProcessedImages.find(({ mainImage }) => mainImage);
      if (mainImage) {
        selectedImage.url = mainImage.url;
        selectedImage.alt = mainImage.alt;
      }
    });

    function getImageHeight() {
      const vh = window.innerHeight / 100;
      return 30 * vh;
    }

    const route = ref(root.$route);
    watch(route, () => {
      if (route.value.query.strain) {
        // do a thing;
      }

      if (route.value.query.size) {
        // do a thing
      }
    });

    const selectedProduct = ref(root.$route.params.productName);
    function onChange(newProduct: string) {
      root.$router.push(`/products/${newProduct}`);
    }

    return {
      selectedProduct,
      onChange,
      products,
      currentPageProduct,
      processedImages,
      selectedImage,
      createUrl,
      getImageHeight
    };
  }
});
</script>
