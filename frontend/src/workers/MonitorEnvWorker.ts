import * as Comlink from 'comlink'

import { MonitorEnvWebWorker } from './MonitorEnvWebWorker'
import Worker from './MonitorEnvWebWorker?worker'

const worker = new Worker()
export const MonitorEnvWorker = Comlink.wrap<typeof MonitorEnvWebWorker>(worker)
