import { ref } from '@vue/composition-api';

export default function useSnackbar() {
  const snackbarMsg = ref('');

  function hideSnackbar() {
    snackbarMsg.value = '';
  }

  function showSnackbar(msg: string, withTimeout?: number) {
    if (withTimeout) {
      snackbarMsg.value = msg;
      setTimeout(hideSnackbar, withTimeout);
    } else {
      snackbarMsg.value = msg;
    }
  }

  return { snackbarMsg, showSnackbar, hideSnackbar };
}
