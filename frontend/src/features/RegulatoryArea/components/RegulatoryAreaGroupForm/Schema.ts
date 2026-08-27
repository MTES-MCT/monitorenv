import { RegulatoryArea } from '@features/RegulatoryArea/types'
import * as Yup from 'yup'

export const RegulatoryAreaGroupFormSchema: Yup.Schema<RegulatoryArea.RegulatoryAreaGroupToApi> = Yup.object().shape({
  additionalRefReg: Yup.array().of(
    Yup.object().shape({
      endDate: Yup.string().optional(),
      id: Yup.string().required(),
      refReg: Yup.string().required(),
      startDate: Yup.string().optional()
    })
  ),
  date: Yup.string().required(),
  dateFin: Yup.string().optional(),
  layerName: Yup.string().required(),
  location: Yup.string().required(),
  refReg: Yup.string().required('La référence réglementaire est obligatoire'),
  regulatoryAreaIds: Yup.array().ensure(),
  type: Yup.string().required(),
  url: Yup.string().required("L'url de la zone réglementée est obligatoire")
})
