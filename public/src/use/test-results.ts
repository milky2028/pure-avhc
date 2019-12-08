import { ref } from '@vue/composition-api';
import TestResult from '../types/TestResult';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';

export type ITestResults = ReturnType<typeof useTestResults>;
export function useTestResults() {
  const testResults = ref([] as TestResult[]);

  async function loadTestResults() {
    return (await workerInstance).getDocuments('testResults');
  }

  (async () => {
    const idbTestResults: TestResult[] | undefined = await get('testResults');
    testResults.value = idbTestResults ? idbTestResults : [];
    testResults.value = (await loadTestResults()) as TestResult[];
    set('testResults', testResults.value);
  })();

  return { testResults, loadTestResults };
}
