import { proxy } from 'comlink';
import { ref, onMounted } from '@vue/composition-api';
import Strain from '@/types/Strain';
import workerInstance from '../workers/entry';

export default function useStrains() {
  const strains = ref([] as Strain[]);

  function loadStrains() {
    return new Promise(async (resolve) => {
      (await workerInstance).getDocuments(
        'products',
        proxy((wStrains) => {
          strains.value = wStrains;
          resolve();
        })
      );
    });
  }

  onMounted(async () => {
    if (strains.value.length < 1) {
      await loadStrains();
    }
  });

  return { loadStrains, strains };
}
