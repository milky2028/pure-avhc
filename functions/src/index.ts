import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';
import WholesaleUserInfo from './types/WholesaleUserInfo';
import Address from './types/Address';
import cors from 'cors';
const c = cors({ origin: true });
admin.initializeApp();

// For Local Testing
// import serviceAccount from './credentials/key.json';
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
// });

async function addAddresses(
  uid: string,
  shippingAddress: Address,
  billingAddress?: Address
) {
  const shippingDoc = { uid, ...shippingAddress };
  const billingDoc = { uid, ...billingAddress };
  const addresses = [billingDoc, shippingDoc];
  const firestore = admin.firestore();
  return await Promise.all(
    addresses.map((doc) => firestore.collection('addresses').add(doc))
  );
}

export const createWholesaleUser = functions.https.onRequest((req, res) =>
  c(req, res, async () => {
    const auth = admin.auth();
    const {
      isExistingUser,
      uid,
      userInfo,
      shippingAddress,
      billingAddress
    }: WholesaleUserInfo = req.body;
    try {
      if (req.method === 'PUT') {
        console.error('Illegal put request');
        return res.sendStatus(403);
      } else if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      } else {
        if (isExistingUser && uid) {
          await auth.setCustomUserClaims(uid, { isWholesaleUser: true });
          return res.sendStatus(200);
        } else if (userInfo) {
          const phoneRegExp = /^\+?[1-9]\d{1,14}$/i;
          if (!phoneRegExp.test(userInfo.phoneNumber)) {
            delete userInfo.phoneNumber;
          }
          const user = await auth.createUser(userInfo);
          await auth.setCustomUserClaims(user.uid, {
            isWholesaleUser: true
          });
          await addAddresses(user.uid, shippingAddress, billingAddress);
          return res.sendStatus(201);
        } else {
          console.error('Missing user info');
          return res.status(406).send('Missing user info');
        }
      }
    } catch (e) {
      console.error(e.errorInfo);
      if (e.errorInfo === 'auth/email-already-exists') {
        const existingNotLoggedInUser = await auth.getUserByEmail(
          userInfo.email
        );
        await auth.setCustomUserClaims(existingNotLoggedInUser.uid, {
          isWholesaleUser: true
        });
        await addAddresses(
          existingNotLoggedInUser.uid,
          shippingAddress,
          billingAddress
        );
        return res.sendStatus(201);
      } else {
        return res.status(400).send(e.errorInfo);
      }
    }
  })
);

export const addSubscriberToMailchimp = functions.firestore
  .document('subscribers/{subscriberId}')
  .onCreate(async (snap) => {
    const documentData = snap.data();
    if (documentData) {
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
