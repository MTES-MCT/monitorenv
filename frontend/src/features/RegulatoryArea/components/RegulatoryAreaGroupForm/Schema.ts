import { RegulatoryArea } from '@features/RegulatoryArea/types'
import * as Yup from 'yup'

export const RegulatoryAreaGroupFormSchema: Yup.Schema<RegulatoryArea.RegulatoryAreaGroupToApi> = Yup.object().shape({
  place: Yup.string().optional(),
  regulatoryAreaIds: Yup.array().ensure().optional(),
  type: Yup.string().optional()
})
