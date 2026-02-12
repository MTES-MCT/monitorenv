import * as Yup from 'yup'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export const RegulatoryAreaFormSchema: Yup.Schema<RegulatoryArea.RegulatoryAreaFromAPI> = Yup.object().shape({
  authorizationPeriods: Yup.string().optional(),
  creation: Yup.string().optional(),
  date: Yup.string().required(),
  dateFin: Yup.string().optional(),
  dureeValidite: Yup.string().optional(),
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
  othersRefReg: Yup.array().of(
    Yup.object().shape({
      endDate: Yup.string().optional(),
      id: Yup.string().required(),
      refReg: Yup.string().required(),
      startDate: Yup.string().optional()
    })
  ),
  plan: Yup.string().required(),
  polyName: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  prohibitionPeriods: Yup.string().optional(),
  refReg: Yup.string().required('La référence réglementaire est obligatoire'),
  resume: Yup.string().optional(),
  source: Yup.string().optional(),
  tags: Yup.array()
    .ensure()
    .test('required-if-no-themes', 'Renseignez au moins un thème ou un tag', (tags, context) => {
      const { themes } = context.parent

      return (tags && tags.length > 0) || (themes && themes.length > 0)
    }),
  temporalite: Yup.string().optional(),
  themes: Yup.array()
    .ensure()
    .test('required-if-no-tags', 'Renseignez au moins un thème ou un tag', (themes, context) => {
      const { tags } = context.parent

      return (themes && themes.length > 0) || (tags && tags.length > 0)
    }),
  type: Yup.string().required('Le type de la zone réglementée est obligatoire'),
  url: Yup.string().required("L'url de la zone réglementée est obligatoire")
})
