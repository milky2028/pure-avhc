<template>
  <PageWrapper>
    <div class="bkg-container">
      <img :src="src" :alt="alt" />
      <div class="content-container">
        <h1>{{ tagline }}</h1>
        <AvButton long class="btn" @btn-click="$router.push('/shop-cbd')">
          Shop All Products
        </AvButton>
      </div>
    </div>
  </PageWrapper>
</template>

<style scoped>
.bkg-container {
  height: calc(100vh - 55px);
  display: grid;
  grid-template-areas: 'main';
}

img {
  grid-area: main;
  height: 100%;
  width: 100vw;
  object-fit: cover;
  object-position: 50% 50%;
}

.content-container {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 1rem;
  font-family: var(--mukta-malar);
  grid-area: main;
  padding: 3rem 3rem calc(55px + 3rem);
}

h1 {
  align-self: end;
  text-transform: uppercase;
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 0.5rem;
  line-height: 1.1;
  color: var(--snackbar-color);
  text-shadow: 1px 2px #5bb6ff, 3px 2px #5bb6ff;
}

.btn {
  align-self: start;
  justify-self: start;
}

@media (max-width: 991px) {
  h1 {
    text-align: center;
    align-self: start;
  }

  .btn {
    align-self: end;
    justify-self: center;
  }
}
</style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import AvButton from '../components/AvButton.vue';
import { defineComponent } from '@vue/composition-api';
import { useWindowWidth } from '../use/window-width';

export default defineComponent({
  components: {
    PageWrapper,
    AvButton
  },
  setup() {
    const alt = process.env.VUE_APP_HOME_ALT;
    const { windowWidth } = useWindowWidth();

    const baseImageUrl = 'https://res.cloudinary.com/pure-avhc/image/upload';
    const dpr = window.devicePixelRatio;
    const imageParams = [
      'f_auto',
      'q_auto:low',
      `w_${Math.round(windowWidth.value * dpr)}`
    ];
    const src = `${baseImageUrl}/${imageParams.join()}/${
      process.env.VUE_APP_HOME_SRC
    }`;

    const tagline = process.env.VUE_APP_HOME_TAGLINE;

    return { alt, src, tagline };
  }
});
</script>
