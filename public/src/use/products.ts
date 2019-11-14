import WorkerEntry from '../workers/worker.entry';
import FirebaseWorker from '@/workers/firebase.worker';
import { Remote } from 'comlink';

async function load() {
  // @ts-ignore
  const _i = await new WorkerEntry();
  const workerInstance = _i as Remote<FirebaseWorker>;
}

const products = load();
export default products;
