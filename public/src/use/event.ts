import { onMounted, onBeforeUnmount } from '@vue/composition-api';

export default function useEvent(
  event: string,
  handler: () => void,
  element = window
) {
  onMounted(() => element.addEventListener(event, handler));
  onBeforeUnmount(() => element.removeEventListener(event, handler));
}
