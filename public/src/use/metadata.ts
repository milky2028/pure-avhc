export function useMetadata() {
  function setTitle(title: string) {
    document.title = title;
  }

  function setMetaDescription(description: string) {
    const metaDescription = document.querySelector(
      '#metaDescription'
    ) as HTMLMetaElement;
    metaDescription.content = description;
  }

  return { setTitle, setMetaDescription };
}
