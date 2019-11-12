import { onMounted, onBeforeUnmount } from '@vue/composition-api';

export default function useEvent(
  event: string,
  handler: (event?: any) => any,
  element = window
) {
  onMounted(() => element.addEventListener(event, handler));
  onBeforeUnmount(() => element.removeEventListener(event, handler));
}
