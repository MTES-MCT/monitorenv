import * as Yup from 'yup'

import type { ControlPlansData } from '../../../../domain/entities/controlPlan'
import type { EnvActionTheme } from '../../../../domain/entities/missions'

export const ThemeSchema: Yup.SchemaOf<EnvActionTheme> = Yup.object().shape({
  protectedSpecies: Yup.array().of(Yup.string().optional()).nullable().optional(),
  subThemes: Yup.array().of(Yup.string().required()).ensure().required().min(1, 'Sous-thématique requise'),
  theme: Yup.string().nullable().required('Thème requis')
})

export const ControlPlansSchema: Yup.SchemaOf<ControlPlansData> = Yup.object().shape({
  subThemeIds: Yup.array().of(Yup.number().required()).ensure().required().min(1, 'Sous-thématique requise'),
  tagIds: Yup.array().of(Yup.number().optional()).nullable().optional(),
  themeId: Yup.number().nullable().required('Thème requis')
})
