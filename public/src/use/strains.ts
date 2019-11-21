import WorkerEntry from '../workers/entry';
import FirebaseWorker from '@/workers/firebase.worker';
import { Remote, proxy } from 'comlink';
import { ref, onMounted } from '@vue/composition-api';
import Strain from '@/types/Strain';

export default function useStrains() {
  const strains = ref([] as Strain[]);

  async function loadStrains() {
    // @ts-ignore
    const _i = await new WorkerEntry();
    const workerInstance = _i as Remote<FirebaseWorker>;
    return workerInstance.getDocuments(
      'products',
      proxy((wStrains) => (strains.value = wStrains))
    );
  }

  onMounted(async () => {
    if (strains.value.length < 1) {
      await loadStrains();
    }
  });

  return { loadStrains, strains };
}
