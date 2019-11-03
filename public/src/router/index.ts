import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store';
import Home from '../views/Home.vue';
// const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue');
const PrivacyPolicy = () =>
  import(/* webpackChunkName: "PrivacyPolicy" */ '../views/PrivacyPolicy.vue');
const ReturnPolicy = () =>
  import(/* webpackChunkName: "ReturnPolicy" */ '../views/ReturnPolicy.vue');
const TermsAndConditions = () =>
  import(
    /* webpackChunkName: "TermsAndConditions" */ '../views/TermsAndConditions.vue'
  );
const ShopCBD = () =>
  import(/* webpackChunkName: "ShopCBD" */ '../views/ShopCBD.vue');
const FeedbackAndSupport = () =>
  import(
    /* webpackChunkName: "FeedbackAndSupport" */ '../views/FeedbackAndSupport.vue'
  );
const TestResults = () =>
  import(/* webpackChunkName: "TestResults" */ '../views/TestResults.vue');
const Login = () =>
  import(/* webpackChunkName: "Login" */ '../views/Login.vue');
const Orders = () =>
  import(/* webpackChunkName: "Orders" */ '../views/Orders.vue');
const Wholesale = () =>
  import(/* webpackChunkName: "Wholesale" */ '../views/Wholesale.vue');
const Cart = () => import(/* webpackChunkName: "Cart" */ '../views/Cart.vue');
const Checkout = () =>
  import(/* webpackChunkName: "Checkout" */ '../views/Checkout.vue');
const SingleOrder = () =>
  import(/* webpackChunkName: "SingleOrder" */ '../views/SingleOrder.vue');
const Product = () =>
  import(/* webpackChunkName: "Product" */ '../views/Product.vue');
const DefinitiveCBDGuide = () =>
  import(
    /* webpackChunkName: "DefinitiveCBDGuide" */ '../views/DefinitiveCBDGuide.vue'
  );
const NotFound = () =>
  import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue');

Vue.use(Router);
const store: any = Store;

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      // @ts-ignore
      beforeEnter(to, from, next) {
        if (!store.state.user.uid) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: '/orders/:orderId',
      name: 'single-order',
      component: SingleOrder,
      // @ts-ignore
      beforeEnter(to, from, next) {
        if (!store.state.user.uid) {
          next('/login');
        } else {
          next();
        }
      }
    },
    {
      path: '/products/:productName',
      name: 'single-product',
      component: Product
    },
    {
      path: '/wholesale',
      name: 'wholesale',
      component: Wholesale
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/shop-cbd',
      name: 'shop-cbd',
      component: ShopCBD
    },
    {
      path: '/definitive-cbd-guide',
      name: 'definitive-cbd-guide',
      component: DefinitiveCBDGuide
    },
    {
      path: '/test-results',
      name: 'test-results',
      component: TestResults
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicy
    },
    {
      path: '/return-policy',
      name: 'return-policy',
      component: ReturnPolicy
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: TermsAndConditions
    },
    {
      path: '/support',
      name: 'support',
      component: FeedbackAndSupport
    },
    {
      path: '/404',
      name: '404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
