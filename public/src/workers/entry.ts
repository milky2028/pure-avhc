import '../types/WebpackWorker';
import Worker from 'worker-loader!../workers/firebase.worker';
import { IFirebaseWorker } from './firebase.worker';
import { wrap } from 'comlink';

async function createWorkerInstance() {
  return wrap<IFirebaseWorker>(new Worker());
}

const workerInstance = createWorkerInstance();
export default workerInstance;
