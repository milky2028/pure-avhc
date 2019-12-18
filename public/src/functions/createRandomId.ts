export default function createRandomId(idLength: number = 12) {
  let text = '';
  const possible = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  for (let i = 0; i < idLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
