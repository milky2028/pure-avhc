export default async function post(url: string, data: {}) {
  try {
    const fetchOptions: RequestInit = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    };
    const response = await fetch(url, fetchOptions);
    if (response.status >= 400) {
      throw new Error(`${response.status}: ${response.statusText}`);
    } else {
      return response;
    }
  } catch (e) {
    throw new Error(e);
  }
}
