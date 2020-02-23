<template>
  <router-link :to="`/products/${product.url}`">
    <div
      class="card"
      :name="alt"
      :style="{
        backgroundImage: url
      }"
      :class="{ hoverLeave }"
      @mouseleave="hoverLeave = true"
      @mouseenter="hoverLeave = false"
    >
      <div class="cover">
        <!-- eslint-disable-next-line -->
        <h2 class="subhead card-font" v-html="splitTitle(product.shortName)" />
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
  padding: 1rem 2rem;
  display: grid;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: var(--dark-accent);
  clip-path: polygon(45% -2%, 75% 102%, -2% 102%, -2% -2%);
}

.card-font {
  font-size: 3rem;
  line-height: 1;
}

a:hover {
  color: white !important;
}

@media (max-width: 835px) {
  .card {
    height: 11vh;
  }
}
</style>

<script lang="ts">
import { ref, defineComponent, inject } from '@vue/composition-api';
import Product from '../types/Product';
import { Modules } from '../use/store';
import { IImages } from '../use/cdn-image';

interface Props {
  product: Product;
}

export default defineComponent<Props>({
  props: {
    product: Object
  },
  setup(props: Props) {
    function splitTitle(title: string) {
      const words = title.split(' ');
      return words.join('<br />');
    }

    const hoverLeave = ref(false);

    const url = ref('');
    const alt = ref('');
    const { getImage } = inject(Modules.images) as IImages;
    const imageRes = getImage(
      props.product.id,
      'toolbarImage',
      135,
      undefined,
      true
    );
    if (imageRes) {
      alt.value = imageRes.alt;
      url.value = imageRes.url;
    }

    return {
      url,
      alt,
      splitTitle,
      hoverLeave
    };
  }
});
</script>
