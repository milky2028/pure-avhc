<template>
  <div class="container">
    <img v-if="product && products.length > 0" :src="url" :alt="alt" />
    <div class="info-container">
      <router-link
        v-if="product && product.name"
        :to="`/products/${product.url}`"
      >
        <h2 class="body-text header">
          {{ product.name }}
        </h2>
      </router-link>
      <div class="select-container">
        <SmallSelector
          label="Qty"
          :select-value="String(cartItem.quantity)"
          :options="options"
          @select-changed="
            updateCartItem({
              cartItemId: cartItem.id,
              newCartItem: {
                quantity: +$event
              }
            })
          "
        />
        <SmallSelector
          v-if="product && product.sizes"
          label="Size"
          :select-value="String(cartItem.size)"
          :options="product.sizes"
          diff-key="id"
          display-key="display"
          value-key="masterMeasurement"
          :display-value-handler="
            product.pluralizeSizes ? getDisplayValue : null
          "
          @select-changed="onSizeChange($event)"
        />
        <SmallSelector
          v-if="strains && strains.length > 0"
          label="Strain"
          :select-value="String(cartItem.strain)"
          :options="strains.slice().sort(sortByStrain)"
          diff-key="id"
          display-key="name"
          value-key="type"
          @select-changed="
            updateCartItem({
              cartItemId: cartItem.id,
              newCartItem: {
                strain: $event
              }
            })
          "
        />
      </div>
      <AvIconButton
        class="remover-icon"
        black
        @icon-click="removeCartItem(cartItem.id)"
      >
        remove_circle_outline
      </AvIconButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2vh 0;
  display: grid;
  grid-template-columns: 100px 1fr;
}

.header {
  color: var(--dark-accent);
  font-weight: 600;
  font-size: 18px;
}

.info-container {
  display: grid;
  padding: 5px 0 5px 12px;
  grid-template-columns: 1fr 32px;
  grid-template-rows: 3rem 1fr;
  column-gap: 8px;
  grid-template-areas:
    'product-name icon'
    'selectors icon';
}

img {
  height: 80px;
  width: 100px;
  object-fit: cover;
  border-radius: var(--rounded-corner);
}

.select-container {
  grid-area: selectors;
  margin-top: 6px;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 4fr 7fr 6fr;
  column-gap: 6px;
  align-items: center;
}

.qty {
  margin-left: 22px;
}

.remover-icon {
  grid-area: icon;
}
</style>

<script lang="ts">
import Product from '../types/Product';
import SmallSelector from '../components/SmallSelector.vue';
import AvIconButton from '../components/AvIconButton.vue';
import Strain from '../types/Strain';
import { IProducts } from '../use/products';
import { computed, Ref, createComponent, inject } from '@vue/composition-api';
import CartItem from '../types/CartItem';
import { Modules } from '../use/store';
import { IImages } from '../use/cdn-image';
import { ICart } from '../use/cart';

interface Props {
  cartItem: CartItem;
  strains: Strain[];
}

export default createComponent<Props>({
  components: {
    SmallSelector,
    AvIconButton
  },
  props: {
    cartItem: Object,
    strains: Array
  },
  setup({ cartItem }: Props) {
    const { products } = inject(Modules.products) as IProducts;
    const product: Ref<Product | undefined> = computed(() =>
      products.value.find(({ id }: Product) => id === cartItem.product)
    );

    const options = [...Array(100).keys()];

    const { getImage } = inject(Modules.images) as IImages;
    const imageRes = computed(() =>
      product.value
        ? getImage(product.value.id, 'toolbarImage', 80, 100)
        : { url: '', alt: '' }
    );
    const url = computed(() => (imageRes.value ? imageRes.value.url : ''));
    const alt = computed(() => (imageRes.value ? imageRes.value.alt : ''));

    function sortByStrain(a: Strain, b: Strain) {
      return a.name > b.name ? 1 : -1;
    }

    function getDisplayValue(value: string) {
      return `${value}${cartItem.quantity > 1 ? 's' : ''}`;
    }

    const { updateCartItem, removeCartItem } = inject(Modules.cart) as ICart;
    function onSizeChange(newSize: string) {
      const newItemSize =
        product && product.value
          ? product.value.sizes.find(
              ({ masterMeasurement }) => masterMeasurement === newSize
            )
          : null;

      if (newItemSize) {
        updateCartItem(
          {
            price: newItemSize.price,
            size: newSize
          },
          cartItem.id
        );
      }
    }

    return {
      products,
      product,
      options,
      alt,
      url,
      sortByStrain,
      getDisplayValue,
      onSizeChange,
      removeCartItem
    };
  }
});
</script>
