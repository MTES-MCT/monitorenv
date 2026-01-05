import { VigilanceArea } from '@features/VigilanceArea/types'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

import type { ImageApi } from '@components/Form/types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const VigilanceAreaSourceSchema: Yup.Schema<Omit<VigilanceArea.VigilanceAreaSource, 'id'>> = Yup.object()
  .shape({
    comments: Yup.string().optional(),
    controlUnitContacts: Yup.array().ensure().optional(),
    email: Yup.string().optional(),
    isAnonymous: Yup.boolean().required(),
    link: Yup.string().optional(),
    name: Yup.string().optional(),
    phone: Yup.string().optional(),
    type: Yup.mixed<VigilanceArea.VigilanceAreaSourceType>()
      .oneOf(Object.values(VigilanceArea.VigilanceAreaSourceType))
      .required('Requis')
  })
  .test(
    'at-least-one-contact',
    'At least one contact method must be provided: name, email, phone, or controlUnitContact',
    value => !!(value?.name || value?.email || value?.phone || (value?.controlUnitContacts?.length ?? 0) > 0)
  )

export const PublishedVigilanceAreaPeriodSchema: Yup.Schema<Omit<VigilanceArea.VigilanceAreaPeriod, 'id'>> =
  Yup.object().shape({
    computedEndDate: Yup.string().optional(),
    endDatePeriod: Yup.string().when('isAtAllTimes', {
      is: false,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Requis')
    }),
    endingCondition: Yup.mixed<VigilanceArea.EndingCondition>()
      .oneOf(Object.values(VigilanceArea.EndingCondition))
      .when('frequency', {
        is: VigilanceArea.Frequency.NONE,
        otherwise: schema =>
          schema.oneOf(Object.values(VigilanceArea.EndingCondition)).when('isAtAllTimes', {
            is: false,
            otherwise: endingConditionSchema => endingConditionSchema.nullable(),
            then: endingConditionSchema => endingConditionSchema.nullable().required('Requis')
          }),
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
    frequency: Yup.mixed<VigilanceArea.Frequency>()
      .oneOf(Object.values(VigilanceArea.Frequency))
      .when('isAtAllTimes', {
        is: false,
        otherwise: schema => schema.nullable(),
        then: schema => schema.nullable().required('Requis')
      }),
    isAtAllTimes: Yup.boolean().required(),
    startDatePeriod: Yup.string().when('isAtAllTimes', {
      is: false,
      otherwise: schema => schema.nullable(),
      then: schema => schema.nullable().required('Requis')
    })
  })

export const DraftVigilanceAreaPeriodSchema: Yup.Schema<Omit<VigilanceArea.VigilanceAreaPeriod, 'id'>> =
  Yup.object().shape({
    computedEndDate: Yup.string().optional(),
    endDatePeriod: Yup.string().optional(),
    endingCondition: Yup.mixed<VigilanceArea.EndingCondition>().optional(),
    endingOccurrenceDate: Yup.string().optional(),
    endingOccurrencesNumber: Yup.number().optional(),
    frequency: Yup.mixed<VigilanceArea.Frequency>().optional(),
    isAtAllTimes: Yup.boolean().required(),
    startDatePeriod: Yup.string().optional()
  })

export const DraftSchema: Yup.Schema<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived' | 'seaFront'>
> = Yup.object()
  .shape({
    comments: Yup.string().optional(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .optional(),
    geom: Yup.mixed<GeoJSON.MultiPolygon>().optional(),
    id: Yup.number().optional(),
    images: Yup.array<ImageApi>().optional(),
    isArchived: Yup.boolean().required(),
    isDraft: Yup.boolean().required(),
    linkedAMPs: Yup.array().optional(),
    linkedRegulatoryAreas: Yup.array().optional(),
    links: Yup.array().optional(),
    name: Yup.string().required(),
    periods: Yup.array().ensure().of(DraftVigilanceAreaPeriodSchema).optional(),
    sources: Yup.array().ensure().of(VigilanceAreaSourceSchema).ensure(),
    tags: Yup.array().ensure().optional(),
    themes: Yup.array().ensure().optional(),
    visibility: Yup.mixed<VigilanceArea.Visibility>().optional()
  })
  .required()

export const PublishedSchema: Yup.Schema<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived' | 'seaFront'>
> = Yup.object()
  .shape({
    comments: Yup.string().required(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .required(),
    geom: Yup.mixed<GeoJSON.MultiPolygon>()
      .test({
        message: 'Veuillez définir une zone de vigilance',
        name: 'has-geom',
        test: val => val && !isEmpty(val?.coordinates)
      })
      .required(),
    id: Yup.number().optional(),
    images: Yup.array<ImageApi>().optional(),
    isArchived: Yup.boolean().required(),
    isDraft: Yup.boolean().required(),
    linkedAMPs: Yup.array().optional(),
    linkedRegulatoryAreas: Yup.array().optional(),
    links: Yup.array().optional(),
    name: Yup.string().required(),
    periods: Yup.array().ensure().of(PublishedVigilanceAreaPeriodSchema).optional(),
    sources: Yup.array().ensure().of(VigilanceAreaSourceSchema).optional(),
    tags: Yup.array()
      .ensure()
      .test('required-if-no-themes', 'Renseignez au moins un thème ou un tag', (tags, context) => {
        const { themes } = context.parent

        return (tags && tags.length > 0) || (themes && themes.length > 0)
      }),
    themes: Yup.array()
      .ensure()
      .test('required-if-no-tags', 'Renseignez au moins un thème ou un tag', (themes, context) => {
        const { tags } = context.parent

        return (themes && themes.length > 0) || (tags && tags.length > 0)
      }),
    visibility: Yup.mixed<VigilanceArea.Visibility>().oneOf(Object.values(VigilanceArea.Visibility)).required()
  })
  .required()

export const VigilanceAreaSchema = Yup.lazy(value => {
  const isVigilanceAreaPublished = !value.isDraft

  if (isVigilanceAreaPublished) {
    return PublishedSchema
  }

  return DraftSchema
})
