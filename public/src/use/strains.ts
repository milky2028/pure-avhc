import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import Strain from '@/types/Strain';
import workerInstance from '../workers/entry';

export type IStrains = ReturnType<typeof useStrains>;
export function useStrains() {
  const strains = ref([] as Strain[]);

  function loadStrains() {
    return new Promise(async (resolve) => {
      (await workerInstance).getDocuments(
        'strains',
        proxy((wStrains) => {
          strains.value = wStrains;
          resolve();
        })
      );
    });
  }

  (async () => {
    if (strains.value.length < 1) {
      await loadStrains();
    }
  })();

  return { loadStrains, strains };
}
