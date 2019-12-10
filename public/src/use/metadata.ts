export function useMetadata() {
  function setTitle(title: string) {
    document.title = `${(process.env
      .VUE_APP_NAME as string).toUpperCase()} | ${title}`;
  }

  function setMetaDescription(description: string) {
    const metaDescription = document.querySelector(
      '#metaDescription'
    ) as HTMLMetaElement;
    metaDescription.content = description;
  }

  return { setTitle, setMetaDescription };
}
