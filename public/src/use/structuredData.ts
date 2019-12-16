export default function useStructuredData() {
  function createStructuredData(structuredData: { [key: string]: any }) {
    removeStructuredData();
    const structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.id = 'structuredData';
    structuredDataScript.textContent = JSON.stringify(structuredData);

    const header = document.querySelector('#header') as HTMLHeadElement;
    header.appendChild(structuredDataScript);
  }

  function removeStructuredData() {
    const strucutedDataScript = document.querySelector(
      '#structuredData'
    ) as HTMLScriptElement;
    const header = strucutedDataScript.parentNode as HTMLHeadElement;
    header.removeChild(strucutedDataScript);
  }

  return { createStructuredData };
}
