import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'

import { Brief as BriefV1, type BriefProps as BriefPropsV1 } from './v1/Brief'
import { Brief, type BriefProps } from './v2/Brief'

export const renderPDF = async (props: BriefProps) => pdf(createElement(Brief, props)).toBlob()

export const renderPDFV1 = async (props: BriefPropsV1) => pdf(createElement(BriefV1, props)).toBlob()
