import { pdf } from '@react-pdf/renderer'
import { createElement } from 'react'

import { Brief, type BriefProps } from './Brief'

export const renderPDF = async (props: BriefProps) => pdf(createElement(Brief, props)).toBlob()
