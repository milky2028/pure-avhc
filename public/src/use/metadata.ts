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
    selectAndSetContent('#ogTitle', fullTitle);
    selectAndSetContent('#twitterTitle', fullTitle);
  }

  function setPageDescription(description: string) {
    selectAndSetContent('#metaDescription', description);
    selectAndSetContent('#itemPropDescription', description);
    selectAndSetContent('#ogDescription', description);
    selectAndSetContent('#twitterDescription', description);
  }

  function setPageImage(imageUrl: string) {
    selectAndSetContent('#metaImage', imageUrl);
    selectAndSetContent('#itemPropImage', imageUrl);
    selectAndSetContent('#ogImage', imageUrl);
    selectAndSetContent('#twitterImage', imageUrl);
  }

  return { setTitle, setPageDescription, setPageImage };
}
