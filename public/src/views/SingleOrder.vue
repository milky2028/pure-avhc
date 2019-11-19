<template>
  <PageWrapper with-padding>
    <ArticlePage title="Order #???">
      <p>Single order page</p>
    </ArticlePage>
  </PageWrapper>
</template>

<style scoped></style>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>
