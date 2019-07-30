<template>
  <div class="card-container">
    <img :src="getSrc(product.id)" :alt="getImageAlt(product.id, images)" />
    <div>
      <h2 class="subhead larger-font">{{ product.shortName }}</h2>
      <p class="body-text">{{ product.tagline }}</p>
      <h3 class="body-text price">{{ getPriceRange(product.sizes) }}</h3>
    </div>
    <div class="btn-container">
      <elianto-button halfBorderRight borderTop borderBottom class="elianto-btn">Add</elianto-button>
      <elianto-button halfBorderLeft borderTop borderBottom class="elianto-btn">Buy</elianto-button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr 75px;
  grid-row-gap: 2vh;
  max-height: 70vmax;
}

img {
  object-fit: cover;
  border-radius: var(--rounded-corner);
  width: 100%;
  max-width: 100vmin;
  height: calc((90vh - 230px) / 2);
}

.larger-font {
  font-weight: 600;
  line-height: 1.2;
  font-size: 24px;
  font-weight: 700;
}

.price {
  font-weight: 600;
  color: var(--dark-accent);
  font-size: 28px;
}

.elianto-btn {
  width: 50%;
}

@media (max-width: 825px) {
  img {
    height: calc((100vmax - 230px) / 2);
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import getImageUrl from '../actors/getImageUrl';
import { mapState, mapActions } from 'vuex';
import WorkerFns from '../types/WorkerFns';
import getImageAlt from '../actors/getImageAlt';
import Image from '../types/Image';
import Size from '../types/Size';
import EliantoButton from '../components/EliantoButton.vue';

export default Vue.extend({
  components: {
    EliantoButton
  },
  props: {
    product: Object
  },
  computed: {
    ...mapState('base', ['imageUrl', 'images'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    getImageAlt,
    getImageHeight() {
      const vh = window.innerHeight / 100;
      const fixedHeights = 230;
      return (window.innerHeight - fixedHeights - 6 * vh) / 2;
    },
    getImageWidth() {
      const windowWidth = window.innerWidth;
      const vw = windowWidth / 100;
      return windowWidth > 825
        ? (windowWidth - 14 * vw) / 3
        : windowWidth - 8 * vw;
    },
    getSrc(id: string) {
      const image = this.images.find(
        (i: Image) => i.product === id && i.allProductsImage
      );
      return getImageUrl(
        this.imageUrl,
        image ? image.url : '',
        this.getImageHeight(),
        this.getImageWidth()
      );
    },
    getPriceRange(sizes: Size[]) {
      if (sizes && sizes.length > 1) {
        const prices = sizes.map((size) => size.price);
        return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
      } else {
        return `$${sizes[0].price}`;
      }
    }
  },
  beforeMount() {
    if (this.images.length < 1) {
      const imagesOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'images'
      };
      this.getFirestoreData(imagesOptions);
    }
  }
});
</script>

