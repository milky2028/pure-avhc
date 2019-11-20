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

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>
