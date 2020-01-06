import { ref } from '@vue/composition-api';

export function useNavbar() {
  const isNavbarExpanded = ref(false);

  function toggleNavbar() {
    isNavbarExpanded.value = !isNavbarExpanded.value;
  }

  return { isNavbarExpanded, toggleNavbar };
}
export type INavbar = ReturnType<typeof useNavbar>;
