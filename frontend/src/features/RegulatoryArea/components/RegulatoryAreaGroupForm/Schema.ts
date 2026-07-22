import { RegulatoryArea } from '@features/RegulatoryArea/types'
import * as Yup from 'yup'

export const RegulatoryAreaGroupFormSchema: Yup.Schema<RegulatoryArea.RegulatoryAreaGroupToApi> = Yup.object().shape({
  location: Yup.string().required(),
  regulatoryAreaIds: Yup.array().ensure(),
  type: Yup.string().required()
})
