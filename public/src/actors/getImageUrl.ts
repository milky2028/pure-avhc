export default function getImageUrl(
  urlBase: string,
  imageUrl: string,
  height: number
) {
  const dpr = window.devicePixelRatio;
  const imageParams = [
    'f_auto',
    'q_auto:low',
    `h_${Math.round(height * dpr)}`,
    'c_fill'
  ];
  return imageUrl ? `${urlBase}${imageParams.join()}${imageUrl}` : '';
}
