<template>
  <EliantoButton :has-border="hasBorder" no-hover :thin-bottom="thinBottom">
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
  touch-action: manipulation;
  display: grid;
  grid-auto-flow: column;
}

.btn-text {
  display: block;
}
</style>

<script lang="ts">
import { defineComponent, computed, inject } from '@vue/composition-api';
import EliantoButton from './EliantoButton.vue';
import AvIconButton from './AvIconButton.vue';
import { Modules } from '../use/store';
import { ICart } from '../use/cart';
import createRandomId from '../functions/createRandomId';
import Product from '../types/Product';
import Size from '../types/Size';
import Strain from '../types/Strain';
import useAnalytics from '../use/analytics';

interface Props {
  [key: string]: Product | Strain | Size | boolean;
  product: Product;
  strain: Strain;
  size: Size;
  hasBorder: boolean;
  thinBottom: boolean;
}

export default defineComponent<Props>({
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
    },
    thinBottom: Boolean
  },
  setup(props: Props) {
    const product = computed(() => props.product);
    const size = computed(() => props.size);
    const strain = computed(() => props.strain);

    const { cartItems } = inject(Modules.cart) as ICart;
    const cartItem = computed(() =>
      size.value && product.value
        ? cartItems.value.find(
            (currentCartItem) =>
              currentCartItem.product === product.value.id &&
              currentCartItem.size === size.value.masterMeasurement &&
              currentCartItem.strain ===
                (strain.value ? strain.value.type : 'any')
          )
        : null
    );

    const btnText = computed(() => cartItem?.value?.quantity ?? 'Add to Cart');

    const { addCartItem, updateCartItem } = inject(Modules.cart) as ICart;
    function descreaseCartQty(cartItemId: string) {
      if (cartItem?.value) {
        updateCartItem(cartItemId, {
          quantity: cartItem.value.quantity - 1
        });
      }
    }

    const { sendEcommerceEvent } = useAnalytics();
    function addToCart({ id }: Product) {
      if (cartItems.value.length === 0) {
        sendEcommerceEvent('addToCart', 'add', product.value.name);
      }

      if (cartItem?.value) {
        updateCartItem(cartItem.value.id, {
          quantity: cartItem.value.quantity + 1
        });
      } else {
        const newCartItem = {
          id: createRandomId(15),
          price: size.value.price,
          quantity: 1,
          product: id,
          size: size.value.masterMeasurement,
          strain: strain.value.type
        };
        addCartItem(newCartItem);
      }
    }

    return { btnText, descreaseCartQty, addCartItem, addToCart, cartItem };
  }
});
</script>
