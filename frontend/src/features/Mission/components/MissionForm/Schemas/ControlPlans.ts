import * as Yup from 'yup'

import type { ControlPlansData } from '../../../../../domain/entities/controlPlan'

export const ClosedControlPlansSchema: Yup.Schema<ControlPlansData> = Yup.object()
  .shape({
    subThemeIds: Yup.array().of(Yup.number().required()).ensure().required().min(1, 'Sous-thématique requise'),
    tagIds: Yup.array().of(Yup.number().required()).optional(),
    themeId: Yup.number().required('Thème requis')
  })
  .defined()

export const NewControlPlansSchema: Yup.Schema<ControlPlansData> = Yup.object()
  .shape({
    subThemeIds: Yup.array().of(Yup.number().required()).required(),
    tagIds: Yup.array().of(Yup.number().required()).required(),
    themeId: Yup.number().optional()
  })
  .defined()
