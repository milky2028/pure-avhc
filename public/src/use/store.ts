import { useCart } from './cart';
import { useCDNImages } from './cdn-image';
import { useProducts } from './products';
import { useTestResults } from './test-results';
import { useUser } from './user';
import { useStrains } from './strains';
import { useDisclaimer } from './disclaimer';
import { useSnackbar } from './snackbar';
import { useOverlay } from './overlay';
import { useNavbar } from './navbar';
import VueCompositionApi from '@vue/composition-api';
import Vue from 'vue';

Vue.use(VueCompositionApi);

export const Modules = {
  cart: Symbol.for('Cart'),
  images: Symbol.for('Images'),
  products: Symbol.for('Products'),
  testResults: Symbol.for('TestResults'),
  user: Symbol.for('User'),
  strains: Symbol.for('Strains'),
  disclaimer: Symbol.for('Disclaimer'),
  snackbar: Symbol.for('Snackbar'),
  overlay: Symbol.for('Overlay'),
  navbar: Symbol.for('Navbar')
};

export const Store = {
  [Modules.cart]: useCart(),
  [Modules.images]: useCDNImages(),
  [Modules.products]: useProducts(),
  [Modules.testResults]: useTestResults(),
  [Modules.user]: useUser(),
  [Modules.strains]: useStrains(),
  [Modules.disclaimer]: useDisclaimer(),
  [Modules.snackbar]: useSnackbar(),
  [Modules.overlay]: useOverlay(),
  [Modules.navbar]: useNavbar()
};
