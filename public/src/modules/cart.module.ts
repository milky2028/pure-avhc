import CartItem from '@/types/CartItem';
import * as idb from 'idb-keyval';
import { Commit } from 'vuex';
import setState from '../actors/setState';

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
    decreaseCartItemQuantity: (state: CartModuleState, id: string) => {
      const cartItem = state.cartItems.find(({ product }) => product === id);
      if (cartItem!.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.product !== id);
      } else {
        cartItem!.quantity--;
      }

      setCartItemsInIdb(state.cartItems);
    },
    removeItemFromCart: (state: CartModuleState, id: string) => {
      state.cartItems = state.cartItems.filter((item) => item.product !== id);

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
