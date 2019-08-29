import * as functions from 'firebase-functions';
import axios, { AxiosRequestConfig } from 'axios';

export const addEmailToList = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  const apiKey = functions.config().mailchimp.key;
  const config: AxiosRequestConfig = {
    headers: {
      'content-type': 'application/json'
    },
    auth: {
      username: 'tyler',
      password: apiKey
    }
  };

  const data = {
    email_address: req.body.email,
    status: 'subscribed',
    merge_fields: {}
  };

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  const url = 'https://us15.api.mailchimp.com/3.0/lists/fdbb4c13c1/members';
  await axios.post(url, data, config).catch((e) => console.error(e));
  return res.sendStatus(200);
});
