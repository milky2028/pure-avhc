import * as functions from 'firebase-functions';

const onUserCreate = functions.auth.user().onCreate((user) => console.log(user));

export default onUserCreate;
