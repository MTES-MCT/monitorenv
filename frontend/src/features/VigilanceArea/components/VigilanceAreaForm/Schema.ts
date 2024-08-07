import { VigilanceArea } from '@features/VigilanceArea/types'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

const ZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de vigilance',
  name: 'has-geom',
  test: val => val && !isEmpty(val?.coordinates)
})

export const DraftSchema: Yup.SchemaOf<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived'>
> = Yup.object()
  .shape({
    comments: Yup.string().nullable(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .nullable(),
    endDatePeriod: Yup.string().nullable(),
    endingCondition: Yup.mixed().nullable(),
    endingOccurrenceDate: Yup.string().nullable(),
    endingOccurrencesNumber: Yup.number().nullable(),
    frequency: Yup.mixed().nullable(),
    geom: Yup.array().of(ZoneSchema).nullable(),
    id: Yup.number().nullable(),
    linkedAMPs: Yup.array().nullable(),
    linkedRegulatoryAreas: Yup.array().nullable(),
    links: Yup.array().nullable(),
    name: Yup.string().required(),
    source: Yup.string().nullable(),
    startDatePeriod: Yup.string().nullable(),
    themes: Yup.array().nullable(),
    visibility: Yup.mixed().nullable()
  })
  .required()

export const PublishedSchema: Yup.SchemaOf<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived'>
> = Yup.object()
  .shape({
    comments: Yup.string().required(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .required(),
    endDatePeriod: Yup.string().required(),
    endingCondition: Yup.mixed()
      .oneOf(Object.values(VigilanceArea.EndingCondition))
      .when('frequency', {
        is: VigilanceArea.Frequency.NONE,
        otherwise: schema => schema.oneOf(Object.values(VigilanceArea.EndingCondition)).required(),
        then: schema => schema.nullable()
      }),
    endingOccurrenceDate: Yup.string().when('endingCondition', {
      is: VigilanceArea.EndingCondition.END_DATE,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Requis')
    }),
    endingOccurrencesNumber: Yup.number().when('endingCondition', {
      is: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Requis')
    }),
    frequency: Yup.mixed().oneOf(Object.values(VigilanceArea.Frequency)).required(),
    geom: Yup.array().of(ZoneSchema).ensure().min(1, 'Veuillez définir une zone de surveillance'),
    id: Yup.number().nullable(),
    linkedAMPs: Yup.array().nullable(),
    linkedRegulatoryAreas: Yup.array().nullable(),
    links: Yup.array().nullable(),
    name: Yup.string().required(),
    startDatePeriod: Yup.string().required(),
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
