import * as Comlink from 'comlink'

import Worker from './MonitorEnvWorker?worker'

const worker = new Worker()
export const MonitorEnvWorker = Comlink.wrap<typeof MonitorEnvWorker>(worker)
