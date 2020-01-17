import * as firebase from '@firebase/testing';
import path from 'path';
import fs from 'fs';

const projectId = 'aspe-f5783';
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;
const rules = fs.readFileSync(
  path.join(__dirname, '../../firestore.rules'),
  'utf8'
);

function authedApp(auth: { uid: string }) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId });
});

beforeEach(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

afterEach(async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe('Database rules', () => {
  it('user should be able to read their own extras data', async () => {
    const uid = 'C6XElkPAcET9EH7koAl7Jh4w0SV2';
    const db = authedApp({ uid });
    const extrasDoc = db.collection('userExtras').doc(uid);
    await firebase.assertSucceeds(extrasDoc.get());
  });
});
