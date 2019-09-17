<template>
  <router-link :to="`/products/${product.url}`">
    <div
      class="card"
      :name="getImageAlt(product.id, images)"
      :style="{ backgroundImage: `url(${getImageUrl(imageUrl, getProductUrl(product.id), 135)})` }"
      :class="hoverLeave ? 'hover-leave' : ''"
      @mouseleave="hoverLeave = true"
      @mouseenter="hoverLeave = false"
    >
      <div class="cover">
        <h2 class="subhead card-font" v-html="splitTitle(product.shortName)"></h2>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
div {
  border-radius: var(--rounded-corner);
}

.card {
  background-color: #fef8f8;
  background-position: 103% 50%;
  background-size: contain;
  background-repeat: no-repeat;
  height: 15vh;
  width: 100%;
  cursor: pointer;
  box-shadow: var(--basic-shadow);
}

.cover {
  padding: 16px;
  display: grid;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--dark-accent);
  clip-path: polygon(45% -2%, 75% 102%, -2% 102%, -2% -2%);
}

.card-font {
  font-size: 26px;
  line-height: 1;
}

a:hover {
  color: white !important;
}

@media (max-width: 825px) {
  .card {
    height: 12vh;
  }
}
</style>


<script lang="ts">
import Vue from 'vue';
import getImageAlt from '../actors/getImageAlt';
import getImageUrl from '../actors/getImageUrl';
import WorkerFns from '../types/WorkerFns';
import { mapState, mapActions } from 'vuex';
import Image from '../types/Image';

export default Vue.extend({
  props: {
    product: Object
  },
  computed: {
    ...mapState('base', ['images', 'imageUrl'])
  },
  data() {
    return {
      hoverLeave: false
    };
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    getImageUrl,
    getImageAlt,
    splitTitle(title: string) {
      const words = title.split(' ');
      words.splice(1, 0, '<br>');
      return words.join(' ');
    },
    getProductUrl(id: string) {
      const image = this.images.find(
        (i: Image) => i.product === id && i.toolbarImage
      );
      return image ? image.url : '';
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
