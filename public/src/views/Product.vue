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
          :src="createUrl(image.url, 80, 100)"
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
        class="product-selector"
        label="Product"
        :options="products"
        loop-key="id"
        display-key="name"
        value-key="url"
        :bound-prop="currentPageProduct.url"
        @select-change="$router.push(`/products/${$event}`)"
      />
      <div class="detail-selectors">
        <AvSelector
          :border-right="true"
          :border-top="false"
          label="Size"
          :options="currentPageProduct.sizes"
          loop-key="id"
          display-key="display"
          value-key="masterMeasurement"
          :bound-prop="selectedSizeType"
        />
        <AvSelector
          :border-top="false"
          label="Strain"
          :options="strains"
          loop-key="id"
          display-key="name"
          value-key="type"
          :bound-prop="selectedStrainType"
          @select-change="selectedStrainType = $event"
        />
      </div>
      <AddToCartButton
        :product="currentPageProduct"
        :has-border="false"
        :strain="fullStrain"
        :size="fullSize"
      />
      <!-- eslint-disable-next-line -->
      <div v-html="currentPageProduct.description"></div>
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
  margin: 1rem 0;
  height: 30vh;
}

.gallery-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 1rem;
}

.gallery-img {
  height: 80px;
  transition: box-shadow 50ms var(--mat-ease);
}

.selectedGalleryImage {
  border: 2px solid var(--dark-accent);
  box-shadow: var(--basic-shadow);
}

.product-selector {
  margin-top: 2rem;
}

.detail-selectors {
  display: grid;
  grid-auto-flow: column;
}

@media (max-width: 835px) {
  .gallery-img {
    height: 60px;
  }
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import AvSelector from '../components/AvSelector.vue';
import AddToCartButton from '../components/AddToCartButton.vue';
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
import { IStrains } from '../use/strains';
import capitalizeFirstLetter from '../functions/capitalizeFirstLetter';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvSelector,
    AddToCartButton
  },
  setup(_, ctx) {
    const { products } = inject(Modules.products) as IProducts;
    const currentPageProduct = computed(() =>
      products.value.find((p) => p.url === ctx.root.$route.params.productName)
    );

    const { strains } = inject(Modules.strains) as IStrains;
    const selectedSizeType = ref('');
    const selectedStrainType = ref('');
    watch(currentPageProduct, (newProduct) => {
      selectedStrainType.value = 'any';

      if (newProduct) {
        const smallestSize = newProduct.sizes.find(
          ({ price }) =>
            price === Math.min(...newProduct.sizes.map(({ price }) => price))
        );
        if (smallestSize) {
          selectedSizeType.value = smallestSize.masterMeasurement;
        }
      }
    });

    const fullStrain = computed(() =>
      strains.value.find(({ type }) => type === selectedStrainType.value)
    );

    const fullSize = computed(() =>
      currentPageProduct.value
        ? currentPageProduct.value.sizes.find(
            ({ masterMeasurement }) =>
              masterMeasurement === selectedSizeType.value
          )
        : null
    );

    const route = ctx.root.$route;
    watch(
      () => ctx.root.$route,
      () => {
        const strain = route.query.strain;
        if (strain) {
          selectedStrainType.value = strain as string;
        }

        const size = route.query.size;
        if (size) {
          selectedSizeType.value = size as string;
        }
      }
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

    return {
      capitalizeFirstLetter,
      selectedStrainType,
      fullStrain,
      fullSize,
      selectedSizeType,
      strains,
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
