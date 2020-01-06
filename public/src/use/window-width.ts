import { ref } from '@vue/composition-api';
import { useEvent } from './event';

export function useWindowWidth() {
  const windowWidth = ref(window.innerWidth);
  useEvent('resize', () => (windowWidth.value = window.innerWidth));
  return { windowWidth };
}
export type IWindowSize = ReturnType<typeof useWindowWidth>;
