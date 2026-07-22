import * as Yup from 'yup'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export const REQUIRED_FIELD = 'Ce champ est obligatoire'

export const RegulatoryAreaFormSchema: Yup.Schema<
  Omit<RegulatoryArea.RegulatoryAreaFromAPI | RegulatoryArea.NewRegulatoryArea, 'isNew' | 'isUpdatedRecently'>
> = Yup.object().shape({
  additionalRefReg: Yup.array().of(
    Yup.object().shape({
      endDate: Yup.string().optional(),
      id: Yup.string().required(),
      refReg: Yup.string().required(),
      startDate: Yup.string().optional()
    })
  ),
  authorizationPeriods: Yup.string().test(
    'required-if-no-resume',
    'Renseignez une période ou un résumé',
    (authorizationPeriods, context) => {
      const { prohibitionPeriods } = context.parent
      const { resume } = context.parent

      return prohibitionPeriods || authorizationPeriods || resume
    }
  ),
  creation: Yup.string().optional(),
  date: Yup.string().required(),
  dateFin: Yup.string().optional(),
  editeur: Yup.string().optional(),
  editionBo: Yup.string().optional(),
  editionCacem: Yup.string().optional(),
  facade: Yup.string().required(),
  geom: Yup.object()
    .shape({
      coordinates: Yup.array().required('Les coordonnées sont obligatoires'),
      type: Yup.string().oneOf(['MultiPolygon']).required('La géométrie est obligatoire')
    })
    .required('La géométrie est obligatoire'),
  id: Yup.number().required(),
  layerName: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  observations: Yup.string().optional(),
  plan: Yup.string().required(),
  polyName: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  prohibitionPeriods: Yup.string().test(
    'required-if-no-resume',
    'Renseignez une période ou un résumé',
    (prohibitionPeriods, context) => {
      const { authorizationPeriods } = context.parent
      const { resume } = context.parent

      return prohibitionPeriods || authorizationPeriods || resume
    }
  ),
  refReg: Yup.string().required('La référence réglementaire est obligatoire'),
  resume: Yup.string().test('required-if-no-periods', 'Renseignez au une période ou un résumé', (resume, context) => {
    const { prohibitionPeriods } = context.parent
    const { authorizationPeriods } = context.parent

    return prohibitionPeriods || authorizationPeriods || resume
  }),
  source: Yup.string().optional(),
  tags: Yup.array().ensure(),
  themes: Yup.array().min(1, 'une thématique est obligatoire'),
  type: Yup.string().required('Le type de la zone réglementée est obligatoire'),
  url: Yup.string().required("L'url de la zone réglementée est obligatoire")
})
