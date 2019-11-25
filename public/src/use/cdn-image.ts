import AvImage from '@/types/AvImage';
import { proxy } from 'comlink';
import { ref, onMounted } from '@vue/composition-api';
import workerInstance from '../workers/entry';

export type IImages = ReturnType<typeof useCDNImages>;
export function useCDNImages() {
  const images = ref([] as AvImage[]);

  function loadImages() {
    return new Promise(async (resolve) => {
      return (await workerInstance).getDocuments(
        'images',
        proxy((imageData) => {
          images.value = imageData;
          resolve();
        })
      );
    });
  }

  onMounted(async () => {
    if (images.value.length < 1) {
      await loadImages();
    }
  });

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
