import { ref } from '@vue/composition-api';

export function useOverlay() {
  const isOverlayShowing = ref(false);

  function toggleOverlay() {
    isOverlayShowing.value = !isOverlayShowing.value;
  }

  return { isOverlayShowing, toggleOverlay };
}
export type IOverlay = ReturnType<typeof useOverlay>;
