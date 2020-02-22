import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import WebCrypto from 'node-webcrypto-ossl';
const crypto = new WebCrypto();

async function createKey() {
  const alg = { name: 'AES-CTR', length: 256 };
  const encrpytionMethods = ['encrypt', 'decrypt'];
  const key = await crypto.subtle.generateKey(alg, true, encrpytionMethods);
  return crypto.subtle.exportKey('jwk', key);
}

const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const firestore = admin.firestore();
  const userDoc = firestore.collection('userExtras').doc(user.uid);

  await userDoc.set({
    cart: [],
    canSubscribe: true,
    userCreated: admin.firestore.FieldValue.serverTimestamp()
  });

  const auth = admin.auth();
  return auth.setCustomUserClaims(user.uid, {
    isAdmin: false,
    isWholesaleUser: false,
    keyCreated: new Date().toJSON(),
    key: JSON.stringify(await createKey())
  });
});

export default onUserCreate;
