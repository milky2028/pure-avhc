<template>
  <div class="card-container">
    <img :src="getSrc(product.id)" :alt="getAlt(product.id)" />
  </div>
</template>

<style scoped>
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
    getSrc(id: string) {
      const image = this.images.find(
        (i: Image) => i.product === id && i.secondaryImage
      );
      return getImageUrl(this.imageUrl, image.url, 500);
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

