export default function getImageUrl(
  urlBase: string,
  imageUrl: string,
  height: number,
  width?: number
) {
  const dpr = window.devicePixelRatio;
  const imageParams = [
    'f_auto',
    'q_auto:low',
    `h_${Math.round(height * dpr)}`,
    'c_fill',
    ...(width ? [`w_${Math.round(width * dpr)}`] : [])
  ];

  return imageUrl ? `${urlBase}${imageParams.join()}${imageUrl}` : '';
}
