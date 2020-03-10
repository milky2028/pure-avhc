import { proxy } from 'comlink';
import { ref, computed, Ref } from '@vue/composition-api';
import Product from '@/types/Product';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';
import Size from '@/types/Size';

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

  function displaySize(size: Ref<Size | null | undefined>) {
    return computed(() => {
      if (size?.value) {
        const sizeRef = size.value;
        if (sizeRef.measurement !== 'gram') {
          return `${sizeRef.measurementValue} ${sizeRef.measurement} ${sizeRef.masterMeasurement}`;
        } else {
          return `${sizeRef.measurementValue} ${sizeRef.measurement}${
            sizeRef.measurementValue > 1 ? 's' : ''
          }`;
        }
      }

      return '';
    });
  }

  return { loadProducts, products, displaySize };
}
export type IProducts = ReturnType<typeof useProducts>;
