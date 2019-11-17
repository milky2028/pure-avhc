import { ref } from '@vue/composition-api';

export default function useOverlay() {
  const isOverlayShowing = ref(false);

  function toggleOverlay() {
    isOverlayShowing.value = !isOverlayShowing.value;
  }

  return { isOverlayShowing, toggleOverlay };
}
