export default async function initializeFirebaseApp(
  firebase: Promise<
    typeof import(/* webpackChunkName: 'firebase' */ 'firebase/app')
  >
) {
  try {
    const fb = await firebase;
    const firebaseConfig = JSON.parse(
      process.env.VUE_APP_FIREBASE_CONFIG as string
    );
    return fb.initializeApp(firebaseConfig);
  } catch (e) {
    throw new Error(e);
  }
}
