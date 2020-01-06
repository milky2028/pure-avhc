import { ref } from '@vue/composition-api';

export function useSnackbar() {
  const snackbarMsg = ref('');

  function hideSnackbar() {
    snackbarMsg.value = '';
  }

  function showSnackbar(msg: string, withTimeout?: number) {
    if (withTimeout) {
      snackbarMsg.value = msg;
      setTimeout(() => hideSnackbar(), withTimeout);
    } else {
      snackbarMsg.value = msg;
    }
  }

  return { snackbarMsg, showSnackbar, hideSnackbar };
}
export type ISnackbar = ReturnType<typeof useSnackbar>;
