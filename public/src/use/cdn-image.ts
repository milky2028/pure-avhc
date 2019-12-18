import AvImage from '@/types/AvImage';
import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import workerInstance from '../workers/entry';
import { set, get } from 'idb-keyval';

export type IImages = ReturnType<typeof useCDNImages>;
export function useCDNImages() {
  const images = ref([] as AvImage[]);

  function loadImages(): Promise<void> {
    return new Promise((resolve) =>
      workerInstance.then((instance) =>
        instance.getDocuments(
          'images',
          proxy((imageData) => {
            images.value = imageData;
            set('images', images.value);
            resolve();
          })
        )
      )
    );
  }

  (async () => {
    const idbImages: AvImage[] | undefined = await get('images');
    images.value = idbImages ? idbImages : [];
    loadImages();
  })();

  function createUrl(
    initialUrl: string,
    height: number,
    width?: number,
    isBackgroundImage?: boolean
  ) {
    const baseImageUrl = 'https://res.cloudinary.com/pure-avhc/image/upload/';
    const dpr = window.devicePixelRatio;
    const imageParams = [
      'f_auto',
      'q_auto:low',
      `h_${Math.round(height * dpr)}`,
      'c_fill',
      ...(width ? [`w_${Math.round(width * dpr)}`] : [])
    ];

    return `${
      isBackgroundImage ? 'url(' : ''
    }${baseImageUrl}${imageParams.join()}${initialUrl}${
      isBackgroundImage ? ')' : ''
    }`;
  }

  function getImage(
    product: string,
    imageType: string,
    height: number,
    width?: number,
    isBackgroundImage?: boolean
  ) {
    const targetImage = images.value.find(
      (image) => image.product === product && image[imageType]
    );
    if (targetImage) {
      const finalizedUrl = createUrl(
        targetImage.url,
        height,
        width,
        isBackgroundImage
      );

      return {
        url: finalizedUrl,
        alt: targetImage.alt
      };
    } else {
      return;
    }
  }

  return { images, loadImages, getImage, createUrl };
}
