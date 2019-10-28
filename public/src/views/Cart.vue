<template>
  <page-wrapper withPadding>
    <article-page title="Cart">
      <div class="item-container" v-if="cartItems.length > 0">
        <cart-item v-for="item in cartItems" :key="item.id" :cartItem="item"></cart-item>
      </div>
      <p v-else>Your cart is empty.</p>
      <divider class="divider"></divider>
      <div class="subtotal-container">
        <p class="subtotal">Subtotal</p>
        <p class="subtotal">${{ subtotal }}</p>
      </div>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.item-container {
  display: grid;
  grid-auto-flow: row;
  row-gap: 2vh;
}

p {
  padding-top: 0;
}

.divider {
  margin-top: 16px;
}

.subtotal-container {
  display: flex;
  justify-content: space-between;
}

.subtotal {
  font-weight: 500;
  font-size: 20px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import CartItem from '../components/CartItem.vue';
import Divider from '../components/Divider.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import WorkerFns from '../types/WorkerFns';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    CartItem,
    Divider
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapState('base', ['products', 'images']),
    ...mapGetters('cart', ['subtotal'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData'])
  },
  mounted() {
    if (this.products.length < 1) {
      const productsOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'products'
      };
      this.getFirestoreData(productsOptions);
    }

    if (this.images.length < 1) {
      const imagesOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'images'
      };
      this.getFirestoreData(imagesOptions);
    }

    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>