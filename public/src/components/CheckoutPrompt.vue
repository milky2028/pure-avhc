<template>
  <transition name="slide-y">
    <div v-if="cartItems && cartItems.length > 0" class="prompt">
      <div class="total-container">
        <h2 class="subhead total">
          {{ route === 'checkout' ? 'Total' : 'Subtotal' }}:
        </h2>
        <h2 class="subhead total money">${{ subtotal.toFixed(2) }}</h2>
      </div>
      <AvButton v-if="route !== 'checkout'" flat class="checkout"
        ><router-link to="/checkout">Checkout ></router-link></AvButton
      >
      <AvButton v-else flat class="checkout">Place Order ></AvButton>
    </div>
  </transition>
</template>

<style scoped>
.prompt {
  padding: 6px 16px 6px 16px;
  z-index: 15;
  position: fixed;
  bottom: 0;
  height: 55px;
  background-color: var(--snackbar-color);
  width: 100%;
  box-shadow: var(--basic-shadow);
  display: grid;
  row-gap: 5px;
  grid-template-areas: 'total checkout';
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 3rem;
  align-items: center;
  overflow: hidden;
  transition: all 300ms var(--ease);
}

.checkout {
  grid-area: checkout;
  color: white !important;
  justify-self: end;
  padding-right: 0;
  justify-content: flex-end;
}

.total-container {
  grid-area: total;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  justify-self: start;
  align-self: center;
}

.money {
  color: var(--light-accent);
}

.total {
  line-height: 1;
  margin-right: 1ch;
}

@media (max-width: 835px) {
  .prompt {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'btn checkout';
  }

  .total-container {
    grid-area: btn;
    flex-direction: column;
  }

  .total {
    font-size: 16px;
  }
}
</style>

<script lang="ts">
import { ref, watch, defineComponent, inject } from '@vue/composition-api';
import AvButton from './AvButton.vue';
import { useWindowWidth } from '../use/window-width';
import { Modules } from '../use/store';
import { ICart } from '../use/cart';

export default defineComponent({
  components: {
    AvButton
  },
  setup(_, ctx) {
    const { windowWidth } = useWindowWidth();

    const expanded = ref(false);
    const { cartItems, subtotal } = inject(Modules.cart) as ICart;
    watch(cartItems, () => {
      if (cartItems.value.length === 0) {
        expanded.value = false;
      }
    });

    function expandOnCheckout(routeName: string) {
      if (routeName === 'checkout') {
        expanded.value = true;
      } else {
        expanded.value = false;
      }
    }

    expandOnCheckout(ctx.root.$route.name as string);
    const route = ref('');
    watch(
      () => ctx.root.$route,
      (newRoute) => {
        route.value = newRoute.name as string;
        expandOnCheckout(route.value);
      }
    );

    return {
      route,
      expanded,
      windowWidth,
      cartItems,
      subtotal
    };
  }
});
</script>
