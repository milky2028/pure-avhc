import AvImage from '@/types/AvImage';
import { proxy } from 'comlink';
import { ref } from '@vue/composition-api';
import workerInstance from '../workers/entry';

export default function useCDNImages() {
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

  async function getImage(
    product: string,
    imageType: string,
    height: number,
    width?: number,
    isBackgroundImage?: boolean
  ) {
    if (images.value.length < 1) {
      await loadImages();
    }
    console.log(images.value);
    const targetImage = images.value.find(
      (image) => image.product === product && image[imageType]
    );
    if (targetImage) {
      const baseImageUrl = 'https://res.cloudinary.com/pure-avhc/image/upload/';
      const dpr = window.devicePixelRatio;
      const imageParams = [
        'f_auto',
        'q_auto:low',
        `h_${Math.round(height * dpr)}`,
        'c_fill',
        ...(width ? [`w_${Math.round(width * dpr)}`] : [])
      ];

      return {
        url: `${
          isBackgroundImage ? 'url(' : ''
        }${baseImageUrl}${imageParams.join()}${targetImage.url}${
          isBackgroundImage ? ')' : ''
        }`,
        alt: targetImage.alt
      };
    } else {
      return;
    }
  }

  return { images, loadImages, getImage };
}
