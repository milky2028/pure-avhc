import * as admin from 'firebase-admin';
import createWholesaleUser from './functions/createWholesaleUser';
import addSubscriberToMailchimp from './functions/addSubscriberToMailchimp';
import dynamicRenderer from './functions/dynamicRenderer';
import backupDatabase from './functions/backupDatabase';

// For Local Testing
// import serviceAccount from './credentials/key.json';
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
// });

// For Production
admin.initializeApp();

exports.createWholesaleUser = createWholesaleUser;
exports.addSubscriberToMailchimp = addSubscriberToMailchimp;
exports.dynamicRendererPure = dynamicRenderer('pure');
exports.dynamicRendererAvhc = dynamicRenderer('avhc');
exports.backupDatabase = backupDatabase;
