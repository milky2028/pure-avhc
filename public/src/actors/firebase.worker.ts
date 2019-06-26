import * as Comlink from 'comlink';

class FirebaseWorker {
  public sayHello() {
    return 'hello';
  }
}

Comlink.expose(FirebaseWorker);
