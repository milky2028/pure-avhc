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
  display: flex;
  align-content: center;
  justify-content: space-around;
}

.btn-text {
  display: block;
}
</style>

<script lang="ts">
import {
  createComponent,
  computed,
  inject,
  watch,
  ref
} from '@vue/composition-api';
import EliantoButton from './EliantoButton.vue';
import AvIconButton from './AvIconButton.vue';
import { Modules } from '../use/store';
import { ICart } from '../use/cart';
import createRandomId from '../functions/createRandomId';
import Product from '../types/Product';
import Size from '../types/Size';
import Strain from '../types/Strain';

interface Props {
  [key: string]: any;
  product: Product;
  strain: Strain;
  size: Size;
  hasBorder: boolean;
  thinBottom: boolean;
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
    },
    thinBottom: Boolean
  },
  setup(props) {
    const product = ref(props.product);
    const size = ref(props.size);
    const strain = ref(props.strain);

    watch(
      () => props.product,
      (newProduct) => (product.value = newProduct)
    );

    watch(
      () => props.size,
      (newSize) => (size.value = newSize)
    );

    watch(
      () => props.strain,
      (newStrain) => (strain.value = newStrain)
    );

    const { cartItems } = inject(Modules.cart) as ICart;
    const cartItem = computed(() =>
      size.value && product.value
        ? cartItems.value.find(
            (cartItem) =>
              cartItem.product === product.value.id &&
              cartItem.size === size.value.masterMeasurement &&
              cartItem.strain === (strain.value ? strain.value.type : 'any')
          )
        : null
    );

    const btnText = computed(() =>
      cartItem && cartItem.value && cartItem.value.quantity
        ? cartItem.value.quantity
        : 'Add to Cart'
    );

    const { addCartItem, updateCartItem } = inject(Modules.cart) as ICart;
    function descreaseCartQty(cartItemId: string) {
      if (cartItem && cartItem.value) {
        updateCartItem(cartItemId, {
          quantity: cartItem.value.quantity - 1
        });
      }
    }

    function addToCart({ id }: Product) {
      if (cartItem && cartItem.value) {
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
          strain: 'any'
        };
        addCartItem(newCartItem);
      }
    }

    return { btnText, descreaseCartQty, addCartItem, addToCart, cartItem };
  }
});
</script>
