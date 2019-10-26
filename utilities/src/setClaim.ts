import * as admin from 'firebase-admin';
import serviceAccount from './credentials/key.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

async function main(args: { userId: string; field: string; fieldValue: any }) {
  const errors = Object.entries(args)
    .filter(([, value]) => value === undefined)
    .map(([key]) => key);

  if (errors.length > 0) {
    throw `Missing arguments:\n${errors.join('\n')}`;
  }

  const { userId, field, fieldValue } = args;

  const convertedValue = !isNaN(+fieldValue)
    ? +fieldValue
    : /^true|false$/.test(fieldValue)
    ? /^true$/.test(fieldValue)
    : fieldValue;

  const auth = admin.auth();
  await auth.setCustomUserClaims(userId, { [field]: convertedValue });
  await auth.revokeRefreshTokens(userId);
  return `${field} successfully set to ${convertedValue} for user ${userId}`;
}

const [, , uid, f, fV] = process.argv;
main({ userId: uid, field: f, fieldValue: fV })
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
