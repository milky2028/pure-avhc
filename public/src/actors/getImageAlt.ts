import Image from '@/types/Image';

export default function getImageAlt(id: string, images: Image[]) {
  const image = images.find((i) => i.product === id && i.mainImage);
  return image ? image.alt : '';
}
