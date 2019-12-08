export default async function initializeFirebaseApp(
  firebase: Promise<
    typeof import(/* webpackChunkName: 'firebase' */ 'firebase/app')
  >
) {
  const fb = await firebase;
  if (fb.apps.length > 0) {
    return fb.app();
  }
  const firebaseConfig = JSON.parse(
    process.env.VUE_APP_FIREBASE_CONFIG as string
  );
  return fb.initializeApp(firebaseConfig);
}
