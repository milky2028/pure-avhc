<template>
  <page-wrapper withPadding>
    <article-page title="Cart">
      <p>Cart page</p>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>