<template>
  <page-wrapper withPadding>
    <article-page title="Test Results">
      <p>Though CBD has been used for centuries, it has become somewhat of a recent phenomenon. Primarily because it is such a new thing, CBD is currently unregulated by the FDA and most other governing bodies. Due to this unregulated nature, there are few quality standards that CBD companies must meet.</p>
      <p>
        Rather than take advantage,
        <strong>{{ fullName }}</strong> seeks to maintain transparency with our customers by publishing up-to-date test results that showcase the purity and high quality of our CBD products. We’ll publish these test results as soon as they’re made available by our testing partners. Please feel free to
        <router-link to="/support">contact us</router-link>&nbsp;if you have any questions about how to understand these results or any other quality-related questions.
      </p>
    </article-page>
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
  },
  data() {
    return {
      fullName: process.env.VUE_APP_FULL_NAME
    };
  }
});
</script>