export default function removeTags(input: string) {
  return `${input
    .slice(0, 160)
    .replace(/<h2>Description<\/h2>|<p>|<\/p>/g, '')
    .trim()}...`;
}
