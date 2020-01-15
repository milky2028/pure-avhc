import Vue from 'vue';
import Router from 'vue-router';
import { Store, Modules } from '@/use/store';
import { IUser } from '@/use/user';
const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue');
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
const Admin = () =>
  import(/* webpackChunkName: "Admin" */ '../views/Admin.vue');
const Shell = () =>
  import(/* webpackChunkName: "Shell" */ '../views/Shell.vue');

Vue.use(Router);

// @ts-ignore
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
      beforeEnter(_, __, next) {
        // @ts-ignore
        if (Store[Modules.user].uid.value) {
          next();
        } else {
          next('/login');
        }
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter(_, __, next) {
        // @ts-ignore
        const userStore = Store[Modules.user] as IUser;
        if (userStore.uid.value && userStore.isAdmin.value) {
          next();
        } else if (userStore.uid.value) {
          next('/orders');
        } else {
          next('/login');
        }
      }
    },
    {
      path: '/orders/:orderId',
      name: 'single-order',
      component: SingleOrder,
      beforeEnter(_, __, next) {
        // @ts-ignore
        if (Store[Modules.user].uid.value) {
          next();
        } else {
          next('/login');
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
      path: '/shell',
      name: 'shell',
      component: Shell
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
