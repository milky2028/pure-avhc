import { ref, Ref } from '@vue/composition-api';

export function useFormErrors() {
  const errors: Ref<string[]> = ref([]);
  const showErrors = ref(false);

  return { errors, showErrors };
}
export type IFormErrors = ReturnType<typeof useFormErrors>;
