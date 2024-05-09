import * as Yup from 'yup'

import type { ControlPlansData } from '../../../../../domain/entities/controlPlan'

export const ClosedControlPlansSchema: Yup.SchemaOf<ControlPlansData> = Yup.object()
  .shape({
    subThemeIds: Yup.array().of(Yup.number().required()).ensure().required().min(1, 'Sous-thématique requise'),
    tagIds: Yup.array().of(Yup.number().optional()).nullable().optional(),
    themeId: Yup.number().required('Thème requis')
  })
  .defined()
