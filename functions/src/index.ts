import * as admin from 'firebase-admin';
import createWholesaleUser from './functions/createWholesaleUser.js';
import addSubscriberToMailchimp from './functions/addSubscriberToMailchimp.js';
import dynamicRenderer from './functions/dynamicRenderer.js';

// For Local Testing
import serviceAccount from './credentials/key.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

// For Production
// admin.initializeApp();

exports.createWholesaleUser = createWholesaleUser;
exports.addSubscriberToMailchimp = addSubscriberToMailchimp;
exports.dynamicRender = dynamicRenderer;
