import { proxy } from 'comlink';
import { ref, onMounted } from '@vue/composition-api';
import Product from '@/types/Product';
import workerInstance from '../workers/entry';

export default function useProducts() {
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

  onMounted(async () => {
    if (products.value.length < 1) {
      await loadProducts();
    }
  });

  return { loadProducts, products };
}
