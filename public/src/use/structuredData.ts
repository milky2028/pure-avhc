export default function useStructuredData() {
  const structuredData = document.querySelector(
    '#structuredData'
  ) as HTMLScriptElement;

  function setStructuredData(structuredData: { [key: string]: any }) {
    clearStructuredData();
    structuredData.textContent = JSON.stringify(structuredData);
  }

  function clearStructuredData() {
    structuredData.textContent = '';
  }

  return { setStructuredData, clearStructuredData };
}
