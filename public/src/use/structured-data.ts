import { onBeforeUnmount } from '@vue/composition-api';

export default function useStructuredData() {
  async function setStructuredData(structuredData: { [key: string]: any }) {
    const purifier = await import('dompurify');
    const structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.textContent = purifier.sanitize(
      JSON.stringify(structuredData)
    );
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
