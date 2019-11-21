import { ref, onMounted } from '@vue/composition-api';
import { Remote } from 'comlink';
import FirebaseWorker from '../workers/firebase.worker';
import TestResult from '../types/TestResult';
import WorkerEntry from '../workers/entry';

export default function useTestResults() {
  const testResults = ref([] as TestResult[]);

  async function loadTestResults() {
    // @ts-ignore
    const _i = await new WorkerEntry();
    const workerInstance = _i as Remote<FirebaseWorker>;
    return workerInstance.getDocuments('testResults');
  }

  onMounted(async () => {
    if (testResults.value.length < 1) {
      testResults.value = (await loadTestResults()) as TestResult[];
    }
  });

  return { testResults, loadTestResults };
}
