<template>
  <PageWrapper with-padding>
    <ArticlePage v-if="currentPageProduct" :title="currentPageProduct.name">
      <img
        loading="lazy"
        :src="createUrl(url, getImageHeight(), windowWidth > 835 ? 680 : 345)"
        :alt="alt"
        class="main-image"
      />
      <div class="gallery-container">
        <img
          v-for="image in filteredImages"
          :key="image.id"
          loading="lazy"
          tabindex="0"
          :src="createUrl(image.url, 80, windowWidth > 835 ? 336 : 100)"
          :alt="image.alt"
          class="gallery-img"
          :class="{ selectedGalleryImage: url === image.url }"
          @click="
            url = image.url;
            alt = image.alt;
          "
        />
      </div>
      <div v-if="fullSize" class="price-container">
        <p class="item-summary">{{ computedDisplaySize }}</p>
        <p class="item-summary price">${{ fullSize.price }}</p>
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
          @select-change="selectedSizeType = $event"
        />
        <AvSelector
          :border-top="false"
          label="Strain"
          :options="filteredAndSortedStrains"
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
        :thin-bottom="true"
      />
      <!-- eslint-disable-next-line -->
      <div class="html-inject" v-html="currentPageProduct.description"></div>
      <div>
        <h2>Strains</h2>
        <div
          v-for="{
            name,
            description,
            id,
            leaflyLink
          } of filteredAndSortedStrains"
          :key="id"
        >
          <h3>
            <a :href="leaflyLink" target="_blank" rel="noopener noreferrer">{{
              name
            }}</a>
            <!-- eslint-disable-next-line -->
            <div class="html-inject" v-html="description"></div>
          </h3>
        </div>
      </div>
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
  height: 36vh;
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

.item-summary {
  font-size: 20px;
  padding: 0;
  font-weight: 600;
}

.price-container {
  padding: 8px 12px;
  display: grid;
  grid-auto-flow: column;
}

.price {
  color: var(--dark-accent);
  text-align: right;
}

.detail-selectors {
  display: grid;
  grid-auto-flow: column;
}

@media (max-width: 835px) {
  .main-image {
    height: 30vh;
  }

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
  defineComponent,
  computed,
  inject,
  watch,
  ref
} from '@vue/composition-api';
import { Modules } from '../use/store';
import { IProducts } from '../use/products';
import { IImages } from '../use/cdn-image';
import { IStrains } from '../use/strains';
import capitalizeFirstLetter from '../functions/capitalizeFirstLetter';
import Strain from '../types/Strain';
import { useWindowWidth } from '../use/window-width';
import { useMetadata } from '../use/metadata';
import useStructuredData from '../use/structured-data';
import removeTags from '../functions/removeTags';

export default defineComponent({
  components: {
    PageWrapper,
    ArticlePage,
    AvSelector,
    AddToCartButton
  },
  setup(_, ctx) {
    const { windowWidth } = useWindowWidth();
    const { products, displaySize } = inject(Modules.products) as IProducts;
    const currentPageProduct = computed(() =>
      products.value.find((p) => p.url === ctx.root.$route.params.productName)
    );

    const { strains } = inject(Modules.strains) as IStrains;
    const selectedStrainType = ref('any');
    watch(currentPageProduct, () => (selectedStrainType.value = 'any'));
    const selectedSizeType = ref('');
    watch(currentPageProduct, () => {
      if (currentPageProduct.value) {
        const smallestSize = currentPageProduct.value.sizes.find(
          (size) =>
            size.price ===
            Math.min(
              ...(currentPageProduct.value
                ? currentPageProduct.value.sizes.map(({ price }) => price)
                : [])
            )
        );

        selectedSizeType.value = smallestSize
          ? smallestSize.masterMeasurement
          : '';
      }
    });

    function sortByName(a: Strain, b: Strain) {
      const aa = a.name;
      const bb = b.name;
      return aa > bb ? 1 : aa < bb ? -1 : 0;
    }

    function filterByProduct(strain: Strain) {
      return currentPageProduct.value
        ? strain.products.includes(currentPageProduct.value.id)
        : false;
    }

    const filteredAndSortedStrains = computed(() =>
      strains.value.filter(filterByProduct).sort(sortByName)
    );

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

    watch(
      () => ctx.root.$route,
      (newRoute) => {
        const strain = newRoute.query.strain;
        if (strain) {
          selectedStrainType.value = strain as string;
        }

        const size = newRoute.query.size;
        if (size) {
          selectedSizeType.value = size as string;
        }
      }
    );

    const { images, createUrl } = inject(Modules.images) as IImages;
    const filteredImages = computed(() =>
      images.value.filter(
        ({ product }) =>
          currentPageProduct.value && product === currentPageProduct.value.id
      )
    );

    const url = ref('');
    const alt = ref('');
    watch(currentPageProduct, () => {
      const selectedMainImage = filteredImages.value.find(
        ({ mainImage }) => mainImage
      );
      url.value = selectedMainImage ? selectedMainImage.url : '';
      alt.value = selectedMainImage ? selectedMainImage.alt : '';
    });
    function getImageHeight() {
      const vh = window.innerHeight / 100;
      return windowWidth.value > 835 ? 40 * vh : 30 * vh;
    }

    const {
      setStructuredData,
      clearStructuredData,
      createProductStructuredData
    } = useStructuredData();
    const { setTitle, setPageDescription, setPageImage } = useMetadata();
    watch(currentPageProduct, (product) => {
      if (product && fullSize.value) {
        setTitle(product.name);
        setPageDescription(removeTags(product.description));
        setPageImage(createUrl(url.value, 675, 1200, false, true));
        clearStructuredData();
        setStructuredData(
          createProductStructuredData(
            product,
            createUrl(url.value, 400, 300, false, true),
            fullSize.value
          )
        );
      }
    });

    const computedDisplaySize = displaySize(fullSize);

    return {
      computedDisplaySize,
      capitalizeFirstLetter,
      selectedStrainType,
      fullStrain,
      fullSize,
      selectedSizeType,
      strains,
      filteredAndSortedStrains,
      products,
      currentPageProduct,
      filteredImages,
      url,
      alt,
      createUrl,
      getImageHeight,
      windowWidth
    };
  }
});
</script>
