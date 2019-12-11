export function useMetadata() {
  const appName = (process.env.VUE_APP_NAME as string).toUpperCase();
  function selectAndSetContent(id: string, content: string) {
    const item = document.querySelector(id) as HTMLMetaElement;
    item.content = content;
  }

  function setTitle(title: string) {
    const fullTitle = `${appName} | ${title}`;
    document.title = fullTitle;
    selectAndSetContent('#itemPropName', fullTitle);
    selectAndSetContent('ogTitle', fullTitle);
  }

  function setMetaDescription(description: string) {
    selectAndSetContent('#metaDescription', description);
  }

  return { setTitle, setMetaDescription };
}
