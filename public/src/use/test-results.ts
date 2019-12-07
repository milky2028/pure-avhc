import { ref } from '@vue/composition-api';
import TestResult from '../types/TestResult';
import workerInstance from '../workers/entry';

export type ITestResults = ReturnType<typeof useTestResults>;
export function useTestResults() {
  const testResults = ref([] as TestResult[]);

  async function loadTestResults() {
    return (await workerInstance).getDocuments('testResults');
  }

  (async () => {
    if (testResults.value.length < 1) {
      testResults.value = (await loadTestResults()) as TestResult[];
    }
  })();

  return { testResults, loadTestResults };
}
