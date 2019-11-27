export default function capitalizeFirstLetter(text: string) {
  return text.replace(/^\w/, (c) => c.toUpperCase());
}
