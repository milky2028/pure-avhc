import Vue from 'vue';
import Vuex from 'vuex';
import BaseModule from './modules/base.module';
import CartModule from './modules/cart.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    base: BaseModule,
    cart: CartModule
  }
});
