import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';

export const createWholesaleUser = functions.https.onRequest(
  async (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Methods', 'GET');
    // res.set('Access-Control-Allow-Headers', 'Content-Type');
    // admin.auth().setCustomUserClaims(uid, { isAdmin: true });
    console.log(req.body.uid);
    try {
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      } else {
        return res.sendStatus(200);
      }
    } catch (e) {
      console.error(e);
      return res.status(400).send(e);
    }
  }
);

export const addSubscriberToMailchimp = functions.firestore
  .document('subscribers/{subscriberId}')
  .onCreate(async (snap) => {
    const documentData = snap.data();
    if (documentData) {
      const apiKey = functions.config().mailchimp.key;
      console.log(documentData.email);

      const config: AxiosRequestConfig = {
        headers: {
          'content-type': 'application/json'
        },
        auth: {
          username: 'tyler',
          password: apiKey
        }
      };

      const payload = {
        email_address: documentData.email,
        status: 'subscribed',
        merge_fields: {}
      };

      try {
        const url =
          'https://us15.api.mailchimp.com/3.0/lists/fdbb4c13c1/members';
        return await axios.post(url, payload, config);
      } catch (e) {
        throw new Error(e);
      }
    } else {
      throw new Error('No document data');
    }
  });
