<template>
  <page-wrapper withPadding>
    <article-page title="Terms and Conditions"></article-page>
  </page-wrapper>
</template>


<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';

export default Vue.extend({
  data() {
    return {
      legalName: process.env.VUE_APP_LEGAL_NAME,
      siteUrl: process.env.VUE_APP_SITE_URL
    };
  },
  components: {
    PageWrapper,
    ArticlePage
  }
});
</script>
