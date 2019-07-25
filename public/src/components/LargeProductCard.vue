<template>
  <div class="card-container">
    <img :src="getSrc(product.id)" :alt="getImageAlt(product.id, images)" />
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr 75px;
  max-height: 70vmax;
}

img {
  object-fit: cover;
  border-radius: var(--rounded-corner);
  width: 100%;
  height: calc((100vh - 230px - 6vh) / 2);
}

@media (max-width: 825px) {
  img {
    height: calc((100vmax - 230px - 6vh) / 2);
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

export default Vue.extend({
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
        ? Math.round(windowWidth - 14 * vw) / 3
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

