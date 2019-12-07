import { ref } from '@vue/composition-api';
import { set, get } from 'idb-keyval';

export type IDisclaimer = ReturnType<typeof useDisclaimer>;
export function useDisclaimer() {
  const isDisclaimerShowing = ref(false);

  function showDisclaimer() {
    isDisclaimerShowing.value = true;
  }

  function hideDisclaimer() {
    set('hasSeenDisclaimer', true);
    isDisclaimerShowing.value = false;
  }

  (async () => {
    const hasSeenDisclaimer = await get('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      showDisclaimer();
    }
  })();

  return { isDisclaimerShowing, showDisclaimer, hideDisclaimer };
}
