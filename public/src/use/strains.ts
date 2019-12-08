import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import Strain from '@/types/Strain';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';

export type IStrains = ReturnType<typeof useStrains>;
export function useStrains() {
  const strains = ref([] as Strain[]);

  function loadStrains() {
    return new Promise(async (resolve) => {
      (await workerInstance).getDocuments(
        'strains',
        proxy((wStrains) => {
          strains.value = wStrains;
          set('strains', strains.value);
          resolve();
        })
      );
    });
  }

  (async () => {
    const idbStrains: Strain[] | undefined = await get('strains');
    strains.value = idbStrains ? idbStrains : [];
    loadStrains();
  })();

  return { loadStrains, strains };
}
