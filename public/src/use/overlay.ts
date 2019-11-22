import { ref } from '@vue/composition-api';

export type IOverlay = ReturnType<typeof useOverlay>;
export function useOverlay() {
  const isOverlayShowing = ref(false);

  function toggleOverlay() {
    isOverlayShowing.value = !isOverlayShowing.value;
  }

  return { isOverlayShowing, toggleOverlay };
}
