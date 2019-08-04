import CartItem from '@/types/CartItem';

interface CartModuleState {
  cartItems: CartItem[];
}

const CartModule = {
  namespaced: true,
  state: {
    cartItems: []
  },
  getters: {
    computedQuantity: (state: CartModuleState) =>
      state.cartItems.length > 0
        ? state.cartItems.reduce((acc, { quantity }) => acc + quantity, 0)
        : 0,
    subtotal: (state: CartModuleState) =>
      state.cartItems.reduce(
        (acc, { quantity, price }) => acc + quantity * price,
        0
      )
  }
};

export default CartModule;
