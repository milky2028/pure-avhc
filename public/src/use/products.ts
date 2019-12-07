import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import Product from '@/types/Product';
import workerInstance from '../workers/entry';

export type IProducts = ReturnType<typeof useProducts>;
export function useProducts() {
  const products = ref([] as Product[]);

  function loadProducts(): Promise<void> {
    return new Promise(async (resolve) => {
      (await workerInstance).getDocuments(
        'products',
        proxy((wProducts) => {
          products.value = wProducts;
          resolve();
        })
      );
    });
  }

  (async () => {
    if (products.value.length < 1) {
      await loadProducts();
    }
  })();

  return { loadProducts, products };
}
