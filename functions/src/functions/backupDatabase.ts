import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const client = new admin.firestore.v1.FirestoreAdminClient();
const bucket = 'gs://avhc-database-backups';
const backupDatabase = functions.pubsub
  .schedule('0 4 * * *')
  .onRun(async () => {
    const databaseName = client.databasePath(
      process.env.GCP_PROJECT,
      '(default)'
    );

    try {
      const responses = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: []
      });

      const response = responses[0];
      console.log(`Operation Name: ${response['name']}`);
      return response;
    } catch (e) {
      console.error(e);
      throw new Error('Export operation failed');
    }
  });

export default backupDatabase;
