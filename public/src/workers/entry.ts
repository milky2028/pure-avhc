import '../types/WebpackWorker';
import WorkerImport from 'worker-loader!../workers/firebase.worker';
import { IFirebaseWorker } from './firebase.worker';
import { wrap } from 'comlink';

async function createWorkerInstance() {
  return wrap<IFirebaseWorker>(new WorkerImport());
}

const workerInstance = createWorkerInstance();
export default workerInstance;
