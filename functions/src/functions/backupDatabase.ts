import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const client = new admin.firestore.v1.FirestoreAdminClient();

const backupDatabase = functions.https.onRequest(async (_, res) => {
  const databaseName = client.databasePath(
    process.env.GCLOUD_PROJECT,
    '(default)'
  );

  try {
    const responses = await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: 'gs://aspe-f5783.appspot.com/backups',
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: []
    });

    const response = responses[0];
    console.log(`Operation Name: ${response['name']}`);
    return res.status(200).send('Backup operation successful');
  } catch (e) {
    console.error(e);
    throw new Error('Export operation failed');
  }
});

export default backupDatabase;
