import WorkerEntry from '../workers/worker.entry';
import FirebaseWorker from '@/workers/firebase.worker';
import { Remote, proxy } from 'comlink';
import { ref, onMounted } from '@vue/composition-api';
import Product from '@/types/Product';

export default function useProducts() {
  const products = ref([] as Product[]);

  async function loadProducts() {
    // @ts-ignore
    const _i = await new WorkerEntry();
    const workerInstance = _i as Remote<FirebaseWorker>;
    return workerInstance.getDocuments(
      'products',
      proxy((wProducts) => (products.value = wProducts))
    );
  }

  onMounted(() => {
    if (products.value.length < 1) {
      loadProducts();
    }
  });

  return { loadProducts, products };
}
