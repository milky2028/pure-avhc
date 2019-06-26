import * as Comlink from 'comlink';

export default class FirebaseWorker {
  public sayHello() {
    console.log('hello!');
  }
}

Comlink.expose(FirebaseWorker);
