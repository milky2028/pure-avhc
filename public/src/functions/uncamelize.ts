export default function uncamelize(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (firstLetter: string) => firstLetter.toUpperCase());
}
