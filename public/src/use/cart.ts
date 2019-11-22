import { ref, computed } from '@vue/composition-api';
import CartItem from '../types/CartItem';
import { set, get } from 'idb-keyval';

export type ICart = typeof useCart;
export function useCart() {
  const cartItems = ref([] as CartItem[]);

  const numberOfItemsInCart = computed(() =>
    cartItems.value.length > 0
      ? cartItems.value.reduce((acc, { quantity }) => quantity + acc, 0)
      : 0
  );

  const subtotal = computed(() =>
    cartItems.value.length > 0
      ? cartItems.value.reduce(
          (acc, { price, quantity }) => acc + quantity * price,
          0
        )
      : 0
  );

  function addCartItem(item: CartItem) {
    cartItems.value = [...cartItems.value, item];
    set('cartItems', cartItems.value);
  }

  function removeCartItem(cartItemId: string) {
    cartItems.value = cartItems.value.filter(({ id }) => id !== cartItemId);
    set('cartItems', cartItems.value);
  }

  function updateCartItem(newCartItem: Partial<CartItem>, cartItemId: string) {
    cartItems.value = cartItems.value
      .map((item) =>
        item.id === cartItemId ? { ...item, ...newCartItem } : { ...item }
      )
      .filter(({ quantity }) => quantity);

    set('cartItems', cartItems.value);
  }

  function clearCart() {
    cartItems.value = [];
    set('cartItems', cartItems.value);
  }

  async function setCartStateFromIdb() {
    const savedCart = (await get('cartItems')) as CartItem[] | undefined;
    if (savedCart) {
      cartItems.value = savedCart;
    }
  }

  return {
    cartItems,
    numberOfItemsInCart,
    subtotal,
    addCartItem,
    removeCartItem,
    updateCartItem,
    clearCart,
    setCartStateFromIdb
  };
}
