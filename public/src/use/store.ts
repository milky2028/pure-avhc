import { useCart } from './cart';
import { useCDNImages } from './cdn-image';
import { useProducts } from './products';
import { useTestResults } from './test-results';
import { useUser } from './user';
import { useStrains } from './strains';
import { useDisclaimer } from './disclaimer';
import { provide } from '@vue/composition-api';

export const Modules = {
  cart: Symbol.for('Cart'),
  images: Symbol.for('Images'),
  products: Symbol.for('Products'),
  testResults: Symbol.for('TestResults'),
  user: Symbol.for('User'),
  strains: Symbol.for('Strains'),
  dislcaimer: Symbol.for('Disclaimer')
};

export function useStore() {
  const Store = {
    [Modules.cart]: useCart,
    [Modules.images]: useCDNImages(),
    [Modules.products]: useProducts(),
    [Modules.testResults]: useTestResults(),
    [Modules.user]: useUser(),
    [Modules.strains]: useStrains(),
    [Modules.dislcaimer]: useDisclaimer()
  };

  for (const [key, val] of Object.entries(Store)) {
    provide(key, val);
  }
}
