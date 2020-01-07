import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import Strain from '@/types/Strain';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';

export function useStrains() {
  const strains = ref([] as Strain[]);

  function loadStrains(): Promise<void> {
    return new Promise((resolve) =>
      workerInstance.then((instance) =>
        instance.queryDocuments(
          {
            collection: 'strains',
            queries: [
              { fieldPath: 'enabled', operator: '==', compareValue: true }
            ]
          },
          proxy((wStrains: Strain[]) => {
            strains.value = wStrains;
            set('strains', strains.value);
            resolve();
          })
        )
      )
    );
  }

  (async () => {
    const idbStrains: Strain[] | undefined = await get('strains');
    strains.value = idbStrains ? idbStrains : [];
    loadStrains();
  })();

  return { loadStrains, strains };
}
export type IStrains = ReturnType<typeof useStrains>;
