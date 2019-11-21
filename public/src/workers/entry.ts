import '../types/WebpackWorker';
import Worker from 'worker-loader!../workers/firebase.worker';
import FirebaseWorker from './firebase.worker';
import { wrap, Remote } from 'comlink';

async function createWorkerInstance() {
  const workerEntryPoint = wrap<FirebaseWorker>(new Worker());
  // @ts-ignore
  const _i = await new workerEntryPoint();
  return _i as Remote<FirebaseWorker>;
}

const workerInstance = createWorkerInstance();
export default workerInstance;
