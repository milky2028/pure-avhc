import Vue from 'vue';
import Router from 'vue-router';
const Home = () => import(/* webpackChunkName: "Home" */ './views/Home.vue');
const PrivacyPolicy = () =>
  import(/* webpackChunkName: "PrivacyPolicy" */ './views/PrivacyPolicy.vue');
const ReturnPolicy = () =>
  import(/* webpackChunkName: "ReturnPolicy" */ './views/ReturnPolicy.vue');
const TermsAndConditions = () =>
  import(
    /* webpackChunkName: "TermsAndConditions" */ './views/TermsAndConditions.vue'
  );
const ShopCBD = () =>
  import(/* webpackChunkName: "ShopCBD" */ './views/ShopCBD.vue');
const FeedbackAndSupport = () =>
  import(
    /* webpackChunkName: "FeedbackAndSupport" */ './views/FeedbackAndSupport.vue'
  );
const TestResults = () =>
  import(/* webpackChunkName: "TestResults" */ './views/TestResults.vue');
const Login = () => import(/* webpackChunkName: "Login" */ './views/Login.vue');
const Orders = () =>
  import(/* webpackChunkName: "Orders" */ './views/Orders.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
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
      component: Orders
    },
    {
      path: '/shop-cbd',
      name: 'shop-cbd',
      component: ShopCBD
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
    }
  ]
});
