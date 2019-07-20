export default function getImageUrl(
  mainImageUrl: string,
  image: string,
  height: number
) {
  const dpr = window.devicePixelRatio;
  const imageParams = [
    'f_auto',
    'q_auto:low',
    `h_${Math.round(height * dpr)}`,
    'c_fill'
  ];
  return `${mainImageUrl}${imageParams.join()}${image}`;
}
