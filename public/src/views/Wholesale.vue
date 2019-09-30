<template>
  <page-wrapper withPadding>
    <article-page title="Wholesale">Wholesale page</article-page>
  </page-wrapper>
</template>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>