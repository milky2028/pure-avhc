import { ref } from '@vue/composition-api';
import useEvent from './event';

export default function useWindowWith() {
  const windowWidth = ref(window.innerWidth);
  useEvent('resize', () => (windowWidth.value = window.innerWidth));
  return { windowWidth };
}
