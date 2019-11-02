<template>
  <page-wrapper withPadding>
    <article-page title="Cart">
      <div v-if="cartItems.length > 0">
        <cart-item
          v-for="(item, i) in cartItems"
          :key="item.id"
          :cartItem="item"
          :strains="strains.filter(({ products }) => products.includes(item.product))"
          :class="{ borderTop: i}"
        ></cart-item>
      </div>
      <p v-if="cartItems.length === 0">Your cart is empty.</p>
      <divider class="divider" :class="{ marginTop: cartItems.length === 0 }"></divider>
      <div class="subtotal-container">
        <p class="subtotal">Subtotal</p>
        <p class="subtotal">${{ subtotal.toFixed(2) }}</p>
      </div>
      <av-button
        long
        v-if="cartItems.length > 0"
        class="clear-btn"
        @btn-click="clearCart"
      >Clear Cart</av-button>
    </article-page>
  </page-wrapper>
</template>

<style scoped>
.parent-container {
  margin-top: 2vh;
  display: grid;
  height: 80vh;
  grid-template-rows: 1fr 1fr;
  justify-self: end;
}

.marginTop {
  margin-top: 1vh;
}

.borderTop {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

p {
  padding-top: 0;
}

.subtotal-container {
  display: flex;
  justify-content: space-between;
}

.subtotal {
  font-weight: 500;
  font-size: 20px;
}

.clear-btn {
  margin: 5vh 0;
}

@media (max-width: 835px) {
  .clear-btn {
    margin: 5vh auto;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import CartItem from '../components/CartItem.vue';
import Divider from '../components/Divider.vue';
import AvButton from '../components/AvButton.vue';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import WorkerFns from '../types/WorkerFns';

export default Vue.extend({
  components: {
    PageWrapper,
    ArticlePage,
    CartItem,
    Divider,
    AvButton
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapState('base', ['products', 'images', 'strains']),
    ...mapGetters('cart', ['subtotal'])
  },
  methods: {
    ...mapActions('base', ['getFirestoreData']),
    ...mapMutations('cart', ['clearCart'])
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

    if (this.strains.length < 1) {
      const strainOptions: WorkerFns = {
        fn: 'getDocuments',
        collection: 'strains'
      };
      this.getFirestoreData(strainOptions);
    }

    window.addEventListener(
      'resize',
      () => (this.windowWidth = window.innerWidth)
    );
  }
});
</script>