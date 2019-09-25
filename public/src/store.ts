import Vue from 'vue';
import Vuex from 'vuex';
import BaseModule from './modules/base.module';
import CartModule from './modules/cart.module';
import UserModule from './modules/user.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    base: BaseModule,
    cart: CartModule,
    user: UserModule
  }
});
