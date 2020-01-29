export function useCrypto(key: JsonWebKey) {
  const cryptoKey = window.crypto.subtle.importKey(
    'jwk',
    key,
    'AES-CTR',
    false,
    ['encrypt', 'decrypt']
  );

  function base64ToUInt8Array(base64: string) {
    return new Uint8Array(
      window
        .atob(base64)
        .split('')
        .map((c) => c.charCodeAt(0))
    );
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    return window.btoa(
      new Uint8Array(buffer).reduce((a, c) => (a += String.fromCharCode(c)), '')
    );
  }

  async function encrypt(input: string) {
    const alg = {
      name: 'AES-CTR',
      counter: new Uint8Array(16),
      length: 128
    };
    const encodedData = new TextEncoder().encode(input);
    const encryptedData = await crypto.subtle.encrypt(
      alg,
      await cryptoKey,
      encodedData
    );
    return arrayBufferToBase64(encryptedData);
  }

  async function decrypt(encryptedData: string) {
    const alg = { name: 'AES-CTR', counter: new Uint8Array(16), length: 128 };
    const encodedData = base64ToUInt8Array(encryptedData);
    const decryptedData = await crypto.subtle.decrypt(
      alg,
      await cryptoKey,
      encodedData
    );
    return new TextDecoder().decode(new Uint8Array(decryptedData));
  }

  return { base64ToUInt8Array, arrayBufferToBase64, encrypt, decrypt };
}
