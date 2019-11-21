import { ref, onMounted } from '@vue/composition-api';
import TestResult from '../types/TestResult';
import workerInstance from '../workers/entry';

export default function useTestResults() {
  const testResults = ref([] as TestResult[]);

  async function loadTestResults() {
    return (await workerInstance).getDocuments('testResults');
  }

  onMounted(async () => {
    if (testResults.value.length < 1) {
      testResults.value = (await loadTestResults()) as TestResult[];
    }
  });

  return { testResults, loadTestResults };
}
