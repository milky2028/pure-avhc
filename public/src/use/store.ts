import { useCart } from './cart';
import { useCDNImages } from './cdn-image';
import { useProducts } from './products';
import { useTestResults } from './test-results';
import { useUser } from './user';
import { useStrains } from './strains';
import { useDisclaimer } from './disclaimer';
import { provide } from '@vue/composition-api';

export const Symbols = {
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
    [Symbols.cart]: useCart(),
    [Symbols.images]: useCDNImages(),
    [Symbols.products]: useProducts(),
    [Symbols.testResults]: useTestResults(),
    [Symbols.user]: useUser(),
    [Symbols.strains]: useStrains(),
    [Symbols.dislcaimer]: useDisclaimer()
  };

  for (const [key, val] of Object.entries(Store)) {
    provide(key, val);
  }
}
