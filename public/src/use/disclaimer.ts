import { ref, onMounted } from '@vue/composition-api';
import * as idb from 'idb-keyval';

export default function useDisclaimer() {
  const isDisclaimerShowing = ref(false);

  function showDisclaimer() {
    isDisclaimerShowing.value = true;
  }

  function hideDisclaimer() {
    idb.set('hasSeenDisclaimer', true);
    isDisclaimerShowing.value = false;
  }

  onMounted(async () => {
    const hasSeenDisclaimer = await idb.get('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      showDisclaimer();
    }
  });

  return { isDisclaimerShowing, showDisclaimer, hideDisclaimer };
}