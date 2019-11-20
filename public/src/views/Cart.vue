<template>
  <PageWrapper with-padding>
    <ArticlePage title="Cart">
      <div v-if="cartItems.length > 0">
        <CartItem
          v-for="(item, i) in cartItems"
          :key="item.id"
          :cart-item="item"
          :strains="
            strains.filter(({ products }) => products.includes(item.product))
          "
          :class="{ borderTop: i }"
        />
      </div>
      <p v-if="cartItems.length === 0">
        Your cart is empty.
      </p>
      <Divider class="divider" :class="{ marginTop: cartItems.length === 0 }" />
      <div class="subtotal-container">
        <p class="subtotal">
          Subtotal
        </p>
        <p class="subtotal">${{ subtotal.toFixed(2) }}</p>
      </div>
      <AvButton
        v-if="cartItems.length > 0"
        long
        class="clear-btn"
        @btn-click="clearCart"
      >
        Clear Cart
      </AvButton>
    </ArticlePage>
  </PageWrapper>
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
import PageWrapper from '../components/PageWrapper.vue';
import ArticlePage from '../components/ArticlePage.vue';
import CartItem from '../components/CartItem.vue';
import Divider from '../components/Divider.vue';
import AvButton from '../components/AvButton.vue';
import useWindowWith from '../use/window-width';
import useProducts from '../use/products';
import useStrains from '../use/strains';
import useCart from '../use/cart';
import { createComponent } from '@vue/composition-api';

export default createComponent({
  components: {
    PageWrapper,
    ArticlePage,
    CartItem,
    Divider,
    AvButton
  },
  setup() {
    const { windowWidth } = useWindowWith();
    const { products } = useProducts();
    const { strains } = useStrains();
    const { subtotal, cartItems, clearCart } = useCart();

    return {
      windowWidth,
      products,
      strains,
      subtotal,
      cartItems,
      clearCart
    };
  }
});
</script>
