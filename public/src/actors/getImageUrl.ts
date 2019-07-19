export default function getImageUrl(
  mainImageUrl: string,
  image: string,
  height = 500
) {
  const dpr = window.devicePixelRatio;
  const imageParams = ['f_auto', 'q_auto', `h_${height * dpr}`, 'c_fill'];
  return `${mainImageUrl}${imageParams.join()}${image}`;
}
