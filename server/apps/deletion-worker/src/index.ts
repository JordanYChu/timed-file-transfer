import 'dotenv/config';
import './producer';  // starts the cron
import './deletion-worker';    // starts listening on the queue

console.log('File deleter worker running');