export default async function initializeAuth(
  firebaseApp: Promise<firebase.app.App>
) {
  const AuthImport = import(
    /* webpackChunkName: 'firebase-auth' */ 'firebase/auth'
  );
  const app = await firebaseApp;
  await AuthImport;
  return app.auth();
}
