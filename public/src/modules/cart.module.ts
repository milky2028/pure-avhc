import Vue from 'vue';
import CartItem from '@/types/CartItem';
import * as idb from 'idb-keyval';
import { Commit } from 'vuex';
import setState from '../functions/setState';

interface Context {
  commit: Commit;
  state?: CartModuleState;
}

interface CartModuleState {
  cartItems: CartItem[];
}

const setCartItemsInIdb = (cartItems: CartItem[]) => {
  idb.set('cart', []);
  idb.set('cart', cartItems);
};

const CartModule = {
  namespaced: true,
  state: {
    cartItems: []
  },
  getters: {
    totalItemsInCart: (state: CartModuleState) =>
      state.cartItems && state.cartItems.length > 0
        ? state.cartItems.reduce((acc, { quantity }) => acc + quantity, 0)
        : 0,
    subtotal: (state: CartModuleState) =>
      state.cartItems.reduce(
        (acc, { quantity, price }) => acc + quantity * price,
        0
      )
  },
  mutations: {
    setState,
    updateCartItem(
      state: CartModuleState,
      {
        newCartItem,
        cartItemId
      }: { newCartItem: Partial<CartItem>; cartItemId: string }
    ) {
      const specifiedCartItem = state.cartItems.find(
        ({ id }) => id === cartItemId
      );
      if (specifiedCartItem) {
        const index = state.cartItems.indexOf(specifiedCartItem);
        Vue.set(state.cartItems, index, {
          ...specifiedCartItem,
          ...newCartItem
        });
      }

      setCartItemsInIdb(state.cartItems);
    },
    addItemToCart: (state: CartModuleState, item: CartItem) => {
      const productsInCart = state.cartItems.map(({ product }) => product);

      if (productsInCart.includes(item.product)) {
        const duplicateItem = state.cartItems.find(
          (product) => product.product === item.product
        );

        duplicateItem!.quantity++;
        state.cartItems = [...state.cartItems];
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      setCartItemsInIdb(state.cartItems);
    },
    setCartItemQuantity(
      state: CartModuleState,
      { quantity, productId }: { quantity: number; productId: string }
    ) {
      const cartItem = state.cartItems.find(
        ({ product }) => product === productId
      );

      if (cartItem) {
        if (quantity === 0) {
          state.cartItems = state.cartItems.filter(
            ({ product }) => product !== productId
          );
        } else {
          cartItem.quantity = quantity;
        }
      }

      setCartItemsInIdb(state.cartItems);
    },
    decreaseCartItemQuantity: (state: CartModuleState, cartItemId: string) => {
      const cartItem = state.cartItems.find(({ id }) => id === cartItemId);
      if (cartItem && cartItem.quantity === 1) {
        state.cartItems = state.cartItems.filter(({ id }) => id !== cartItemId);
      } else {
        cartItem!.quantity--;
      }

      setCartItemsInIdb(state.cartItems);
    },
    removeItemFromCart: (state: CartModuleState, cartItemId: string) => {
      state.cartItems = state.cartItems.filter(({ id }) => id !== cartItemId);

      setCartItemsInIdb(state.cartItems);
    },
    clearCart: (state: CartModuleState) => {
      state.cartItems = [];
      setCartItemsInIdb(state.cartItems);
    }
  },
  actions: {
    setCartStateFromSave: async ({ commit }: Context) => {
      const savedCartState = (await idb.get('cart')) as CartItem[] | undefined;

      if (savedCartState) {
        commit('setState', { type: 'cartItems', data: savedCartState });
      }
    }
  }
};

export default CartModule;
