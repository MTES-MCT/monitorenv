import { VigilanceArea } from '@features/VigilanceArea/types'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

const ZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de vigilance',
  name: 'has-geom',
  test: val => val && !isEmpty(val?.coordinates)
})

export const DraftSchema: Yup.SchemaOf<VigilanceArea.VigilanceArea> = Yup.object()
  .shape({
    comments: Yup.string().nullable(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .nullable(),
    endingCondition: Yup.mixed().nullable(),
    endingOccurenceDate: Yup.string().nullable(),
    endingOccurrencesNumber: Yup.number().nullable(),
    frequency: Yup.mixed().nullable(),
    geom: Yup.array().nullable(),
    links: Yup.array().nullable(),
    name: Yup.string().nullable(),
    period: Yup.array().nullable(),
    source: Yup.string().nullable(),
    themes: Yup.array().nullable(),
    visibility: Yup.mixed().nullable()
  })
  .required()

export const PublishedSchema: Yup.SchemaOf<VigilanceArea.VigilanceArea> = Yup.object()
  .shape({
    comments: Yup.string().required(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .required(),
    endingCondition: Yup.mixed().oneOf(Object.values(VigilanceArea.EndingCondition)).required(),
    endingOccurenceDate: Yup.string().when('endingCondition', (endingCondition, schema) => {
      if (endingCondition === VigilanceArea.EndingCondition.END_DATE) {
        return schema.nullable().required('Requis')
      }

      return schema.nullable()
    }),
    endingOccurrencesNumber: Yup.number().when('endingCondition', (endingCondition, schema) => {
      if (endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER) {
        return schema.nullable().required('Requis')
      }

      return schema.nullable()
    }),
    frequency: Yup.mixed().oneOf(Object.values(VigilanceArea.Frequency)).required(),
    geom: Yup.array().of(ZoneSchema).ensure().min(1, 'Veuillez définir une zone de surveillance'),
    name: Yup.string().required(),
    period: Yup.array().ensure().defined().min(1),
    themes: Yup.array().ensure().defined().min(1),
    visibility: Yup.mixed().oneOf(Object.values(VigilanceArea.Visibility)).required()
  })
  .required()

export const VigilanceAreaSchema = Yup.lazy(value => {
  const isMissionPublished = !value.isDraft

  if (isMissionPublished) {
    return PublishedSchema
  }

  return DraftSchema
})
