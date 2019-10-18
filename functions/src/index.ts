import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';
import WholesaleUserInfo from '../../shared-types/WholesaleUserInfo';

export const createWholesaleUser = functions.https.onRequest(
  async (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Methods', 'GET');
    // res.set('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.body.uid);
    try {
      if (req.method === 'PUT') {
        console.error('Illegal put request');
        return res.sendStatus(403);
      } else if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      } else {
        const auth = admin.auth();
        const {
          isExistingUser,
          uid,
          userInfo,
          shippingAddress,
          billingAddress
        }: WholesaleUserInfo = req.body;
        if (isExistingUser && uid) {
          await auth.setCustomUserClaims(uid, { isWholesaleUser: true });
          return res.sendStatus(200);
        } else if (userInfo) {
          const user = await auth.createUser(userInfo);
          await auth.setCustomUserClaims(user.uid, { isWholesaleUser: true });
          const shippingDoc = { uid: user.uid, ...shippingAddress };
          const billingDoc = { uid: user.uid, ...billingAddress };
          const addresses = [billingDoc, shippingDoc];
          const firestore = admin.firestore();
          await Promise.all(
            addresses.map((doc) => firestore.collection('addresses').add(doc))
          );
          return res.sendStatus(201);
        } else {
          console.error('Missing user info');
          return res.status(406).send('Missing user info');
        }
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
