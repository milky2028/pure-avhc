import { onBeforeUnmount } from '@vue/composition-api';

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
    selectAndSetContent('#ogUrl', location.href.split('?')[0]);
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

  function resetImage() {
    const siteUrl = process.env.VUE_APP_SITE_URL;
    setPageImage(`https://${siteUrl}/og-image.jpg`);
  }

  onBeforeUnmount(() => resetImage());

  return { setTitle, setPageDescription, setPageImage, resetImage };
}
