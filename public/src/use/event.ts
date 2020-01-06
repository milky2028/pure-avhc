import { onMounted, onBeforeUnmount } from '@vue/composition-api';

export function useEvent(
  windowEvent: string,
  handler: (event?: any) => any,
  element = window
) {
  onMounted(() => element.addEventListener(windowEvent, handler));
  onBeforeUnmount(() => element.removeEventListener(windowEvent, handler));
}
export type IEvent = ReturnType<typeof useEvent>;
