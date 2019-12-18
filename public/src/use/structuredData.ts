import { onBeforeUnmount } from '@vue/composition-api';

export default function useStructuredData() {
  function setStructuredData(structuredData: { [key: string]: any }) {
    const structuredDataScript = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredDataScript.textContent = JSON.stringify(structuredData);
    const head = document.getElementById('header') as HTMLHeadElement;
    head.appendChild(structuredDataScript);
  }

  function clearStructuredData() {
    const allScripts = document.getElementsByTagName('script')
    for (const script of allScripts) {
      if (script.type === 'application/ld+json') {
        script.remove();
      }
    }
  }

  onBeforeUnmount(() => clearStructuredData());

  return { setStructuredData, clearStructuredData };
}
