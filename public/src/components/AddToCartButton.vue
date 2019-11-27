<template>
  <EliantoButton :has-border="hasBorder" no-hover>
    <span class="add-or-subtract-container">
      <AvIconButton
        v-if="cartItem && cartItem.quantity > 0"
        black
        @icon-click="descreaseCartQty(cartItem.id)"
        >remove_circle_outline</AvIconButton
      >
      <span class="btn-text" @click="addToCart(product)">
        {{ btnText }}
      </span>
      <AvIconButton
        v-if="cartItem && cartItem.quantity > 0"
        black
        @icon-click="addToCart(product)"
        >add_circle_outline</AvIconButton
      >
    </span>
  </EliantoButton>
</template>

<style scoped>
.add-or-subtract-container {
  display: flex;
  align-content: center;
  justify-content: space-around;
}

.btn-text {
  display: block;
}
</style>

<script lang="ts">
import { createComponent, computed, inject, watch } from '@vue/composition-api';
import EliantoButton from './EliantoButton.vue';
import AvIconButton from './AvIconButton.vue';
import { Modules } from '../use/store';
import { ICart } from '../use/cart';
import createRandomId from '../functions/createRandomId';
import Product from '../types/Product';
import Size from '../types/Size';
import Strain from '../types/Strain';

interface Props {
  product: Product;
  strain: Strain;
  size: Size;
  hasBorder: boolean;
}

export default createComponent<Props>({
  components: {
    EliantoButton,
    AvIconButton
  },
  props: {
    product: {
      default: null,
      type: Object
    },
    strain: {
      type: Object,
      default: null
    },
    size: {
      type: Object,
      default: null
    },
    hasBorder: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    watch(
      () => props.size,
      (newProp, oldProp) => console.log(newProp, oldProp)
    );

    const { cartItems } = inject(Modules.cart) as ICart;
    const cartItem = computed(() =>
      cartItems.value.find(
        (cartItem) =>
          cartItem.product === props.product.id &&
          cartItem.size === props.size.masterMeasurement &&
          cartItem.strain === (props.strain ? props.strain.type : 'any')
      )
    );

    const btnText = computed(() =>
      cartItem && cartItem.value && cartItem.value.quantity
        ? cartItem.value.quantity
        : 'Add to Cart'
    );

    const { addCartItem, updateCartItem } = inject(Modules.cart) as ICart;
    function descreaseCartQty(cartItemId: string) {
      if (cartItem && cartItem.value) {
        updateCartItem(
          {
            quantity: cartItem.value.quantity - 1
          },
          cartItemId
        );
      }
    }

    function addToCart({ id }: Product) {
      if (cartItem && cartItem.value) {
        updateCartItem(
          {
            quantity: cartItem.value.quantity + 1
          },
          cartItem.value.id
        );
      } else {
        const newCartItem = {
          id: createRandomId(15),
          price: props.size.price,
          quantity: 1,
          product: id,
          size: props.size.masterMeasurement,
          strain: 'any'
        };
        addCartItem(newCartItem);
      }
    }

    return { btnText, descreaseCartQty, addCartItem, addToCart, cartItem };
  }
});
</script>
