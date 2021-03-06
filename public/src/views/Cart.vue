<template>
  <PageWrapper with-padding>
    <ArticlePage title="Cart">
      <div v-if="cartItems.length > 0" class="mt">
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
      <p v-if="cartItems.length === 0" class="mt no-items">
        Your cart is empty.
      </p>
      <Divider class="divider" :class="{ mt: cartItems.length === 0 }" />
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
.borderTop {
  border-top: var(--faint-grey);
}

.no-items {
  padding-top: 0;
}

.subtotal-container {
  display: flex;
  justify-content: space-between;
}

.subtotal {
  padding-top: 0;
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
import { useWindowWidth } from '../use/window-width';
import { defineComponent, inject } from '@vue/composition-api';
import { Modules } from '../use/store';
import { IStrains } from '../use/strains';
import { ICart } from '../use/cart';
import { useMetadata } from '../use/metadata';

export default defineComponent({
  components: {
    PageWrapper,
    ArticlePage,
    CartItem,
    Divider,
    AvButton
  },
  setup() {
    const { windowWidth } = useWindowWidth();
    const { strains } = inject(Modules.strains) as IStrains;
    const { subtotal, cartItems, clearCart } = inject(Modules.cart) as ICart;

    const { setTitle, setPageDescription } = useMetadata();
    setTitle('Cart');
    setPageDescription(
      `${process.env.VUE_APP_FULL_NAME}'s Cart, where you can view and verify items in your cart before making a purchase. Follow through to Checkout in order to complete your purchase.`
    );

    return {
      windowWidth,
      strains,
      subtotal,
      cartItems,
      clearCart
    };
  }
});
</script>
