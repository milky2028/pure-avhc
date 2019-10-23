import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';

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
        if (documentData.uid) {
          const firestore = admin.firestore();
          const userExtrasDoc = firestore
            .collection('userExtras')
            .doc(documentData.uid);
          const docExists = (await userExtrasDoc.get()).exists;
          if (docExists) {
            await userExtrasDoc.update({ canSubscribe: false });
          } else {
            await userExtrasDoc.set({ canSubscribe: false });
          }
        }
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
