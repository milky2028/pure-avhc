<template>
  <page-wrapper withPadding>
    <article-page title="Checkout">
      <p>Checkout page</p>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import CartItem from '../components/CartItem.vue';
import { mapState } from 'vuex';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    CartItem
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('cart', ['cartItems'])
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>