import { ref, onMounted } from '@vue/composition-api';
import { set, get } from 'idb-keyval';

export type IDisclaimer = typeof useDisclaimer;
export function useDisclaimer() {
  const isDisclaimerShowing = ref(false);

  function showDisclaimer() {
    isDisclaimerShowing.value = true;
  }

  function hideDisclaimer() {
    set('hasSeenDisclaimer', true);
    isDisclaimerShowing.value = false;
  }

  onMounted(async () => {
    const hasSeenDisclaimer = await get('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      showDisclaimer();
    }
  });

  return { isDisclaimerShowing, showDisclaimer, hideDisclaimer };
}
