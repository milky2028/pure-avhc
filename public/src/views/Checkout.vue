<template>
  <PageWrapper with-padding>
    <ArticlePage title="Checkout">
      <p>Checkout page</p>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped></style>

<script lang="ts">
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import { createComponent } from '@vue/composition-api';
import { useMetadata } from '../use/metadata';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  },
  setup() {
    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Checkout');
    setPageDescription(
      `${process.env.VUE_APP_FULL_NAME}'s Checkout. Here, you can complete your purchase and get ready to have your CBD Flower products shipped directly to your door.`
    );
  }
});
</script>
