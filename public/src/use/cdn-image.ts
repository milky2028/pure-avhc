import AvImage from '@/types/AvImage';

export default function useCDNImages(images: AvImage[], height: number, width?: number, imageType: string, isBackgroundImage: boolean) {
  const images = 'thing' // here images are fetched as a promise and return static data;
  const baseImageData = images.find()
  const imageUrlBase = 'https://res.cloudinary.com/pure-avhc/image/upload/';
  const dpr = window.devicePixelRatio;
  const imageParams = [
    'f_auto',
    'q_auto:low',
    `h_${Math.round(height * dpr)}`,
    'c_fill',
    ...(width ? [`w_${Math.round(width * dpr)}`] : [])
  ];

  `${imageUrlBase}${imageParams.join()}${imageUrl}`;

  return { loadImages }
}

 function getImageAlt(id: string, images: Image[]): string {
  const image = images.find((i) => i.product === id && i.mainImage);
  return image ? image.alt : '';
}

getProductUrl(id: string) {
  const image = this.images.find(
    (i: Image) => i.product === id && i.toolbarImage
  );
  return image ? image.url : '';
}


// Do I use a snapshot? Or a static get? Maybe a snapshot for images. Either way, the final API will be images: ref<AvImage[]>, loadImages, getImage(product: string, type: string): { url: string, alt: string }

// must load images before getting single image is possible