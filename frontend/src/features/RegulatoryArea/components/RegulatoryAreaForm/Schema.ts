import * as Yup from 'yup'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export const RegulatoryAreaFormSchema: Yup.Schema<RegulatoryArea.RegulatoryAreaFromAPI> = Yup.object().shape({
  creation: Yup.string().optional(),
  date: Yup.string().optional(),
  dateFin: Yup.string().optional(),
  dureeValidite: Yup.string().optional(),
  editeur: Yup.string().optional(),
  editionBo: Yup.string().optional(),
  editionCacem: Yup.string().optional(),
  facade: Yup.string().optional(),
  geom: Yup.object()
    .shape({
      coordinates: Yup.array().required('Les coordonnées sont obligatoires'),
      type: Yup.string().oneOf(['MultiPolygon']).required('La géométrie est obligatoire')
    })
    .required('La géométrie est obligatoire'),
  id: Yup.number().required(),
  layerName: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  observations: Yup.string().optional(),
  plan: Yup.string().optional(),
  polyName: Yup.string().required('Le nom de la zone réglementée est obligatoire'),
  refReg: Yup.string().required('La référence réglementaire est obligatoire'),
  resume: Yup.string().optional(),
  source: Yup.string().optional(),
  tags: Yup.array().ensure().optional(),
  temporalite: Yup.string().optional(),
  themes: Yup.array().ensure().optional(),
  type: Yup.string().required('Le type de la zone réglementée est obligatoire'),
  url: Yup.string().url("L'URL doit être valide").required()
})
