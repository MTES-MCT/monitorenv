import * as Yup from 'yup'

import type { ThemeTable } from '../../../../../domain/entities/themes'

export const BaseThemeSchema: Yup.Schema<Omit<ThemeTable, 'parentId' | 'subRows' | 'subThemes' | 'rowId'>> =
  Yup.object().shape({
    endedAt: Yup.string()
      .optional()
      .test('is-after-start', 'La date de fin doit être après la date de début', function (value) {
        const { startedAt } = this.parent
        if (!value || !startedAt) {
          return true
        }

        return new Date(value) > new Date(startedAt)
      }),
    name: Yup.string().required(),
    startedAt: Yup.string().required()
  })

export const ThemeFormSchema = BaseThemeSchema.concat(
  Yup.object({
    subThemes: Yup.array().of(BaseThemeSchema).ensure()
  })
)
