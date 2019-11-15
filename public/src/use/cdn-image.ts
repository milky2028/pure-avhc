import AvImage from '@/types/AvImage';
import WorkerEntry from '../workers/worker.entry';
import FirebaseWorker from '@/workers/firebase.worker';
import { Remote, proxy } from 'comlink';
import { ref, Ref } from '@vue/composition-api';

export default function useCDNImages() {
  const images: Ref<AvImage[]> = ref([]);

  async function loadImages() {
    // @ts-ignore
    const _i = await new WorkerEntry();
    const workerInstance = _i as Remote<FirebaseWorker>;
    return workerInstance.getDocuments(
      'images',
      proxy((imageData) => (images.value = imageData))
    );
  }

  async function getImage(
    product: string,
    imageType: string,
    height: number,
    isBackgroundImage?: boolean,
    width?: number
  ) {
    if (images.value.length < 1) {
      await loadImages();
    }

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
