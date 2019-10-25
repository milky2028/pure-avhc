import * as admin from 'firebase-admin';
import serviceAccount from './credentials/key.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

async function main(
  userId: string,
  field: string,
  fieldValue: any,
  type: string
) {
  const convertedValue =
    type === 'bool'
      ? /true/i.test(fieldValue)
      : type === 'number'
      ? +fieldValue
      : fieldValue;
  const auth = admin.auth();
  await auth.setCustomUserClaims(userId, { [field]: convertedValue });
  await auth.revokeRefreshTokens(userId);
  return 'Successfully set custom claim';
}

const [, , uid, f, fV, t] = process.argv;
main(uid, f, fV, t)
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
