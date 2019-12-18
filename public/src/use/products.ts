import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import Product from '@/types/Product';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';

export type IProducts = ReturnType<typeof useProducts>;
export function useProducts() {
  const products = ref([] as Product[]);

  function loadProducts(): Promise<void> {
    return new Promise((resolve) =>
      workerInstance.then((instance) =>
        instance.getDocuments(
          'products',
          proxy((wProducts) => {
            products.value = wProducts;
            set('products', products.value);
            resolve();
          })
        )
      )
    );
  }

  (async () => {
    const idbProducts: Product[] | undefined = await get('products');
    products.value = idbProducts ? idbProducts : [];
    loadProducts();
  })();

  return { loadProducts, products };
}
