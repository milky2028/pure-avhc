import '../types/WebpackWorker';
import Worker from 'worker-loader!../workers/firebase.worker';
import FirebaseWorker from './firebase.worker';
import { wrap } from 'comlink';

export default wrap<FirebaseWorker>(new Worker());
