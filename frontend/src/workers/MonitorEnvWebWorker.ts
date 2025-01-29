import * as Comlink from 'comlink'

import { renderPDF, renderPDFV1 } from '../features/Dashboard/components/Pdf/renderPdf'

import type { BriefProps as BriefPropsV1 } from '../features/Dashboard/components/Pdf/v1/Brief'
import type { BriefProps } from '../features/Dashboard/components/Pdf/v2/Brief'

/**
 * /!\ Do not shorten imports in the Web worker.
 * It will fail the Vite build : `Rollup failed to resolve import [...]`
 */

export class MonitorEnvWebWorker {
  static renderPDFInWorker = async (props: BriefProps) => {
    const blob = await renderPDF(props)

    return URL.createObjectURL(blob)
  }

  static renderPDFInWorkerV1 = async (props: BriefPropsV1) => {
    const blob = await renderPDFV1(props)

    return URL.createObjectURL(blob)
  }
}

Comlink.expose(MonitorEnvWebWorker)
