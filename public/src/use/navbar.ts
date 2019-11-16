import { ref } from '@vue/composition-api';

export default function useNavbar() {
  const isNavbarExpanded = ref(false); 

  function toggleNavbar() {
    isNavbarExpanded.value = !isNavbarExpanded.value;
  }

  return { isNavbarExpanded, toggleNavbar  };
}