import * as Yup from 'yup'

import type { EnvActionTheme } from '../../../../domain/entities/missions'

export const ThemeSchema: Yup.SchemaOf<EnvActionTheme> = Yup.object().shape({
  protectedSpecies: Yup.array().of(Yup.string().optional()).nullable().optional(),
  subThemes: Yup.array()
    .of(Yup.string().required())
    .ensure()
    .required()
    .min(1, 'Sélectionnez au moins une sous thématique'),
  theme: Yup.string().nullable().required('Sélectionnez un thème')
})
