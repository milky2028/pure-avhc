import { onBeforeUnmount } from '@vue/composition-api';

export default function useStructuredData() {
  function setStructuredData(structuredData: { [key: string]: any }) {
    const structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.textContent = JSON.stringify(structuredData);
    document.head.insertAdjacentElement('beforeend', structuredDataScript);
  }

  function clearStructuredData() {
    const allScripts = document.getElementsByTagName('script');
    for (const script of allScripts) {
      if (script.type === 'application/ld+json') {
        script.remove();
      }
    }
  }

  onBeforeUnmount(() => clearStructuredData());

  return { setStructuredData, clearStructuredData };
}
