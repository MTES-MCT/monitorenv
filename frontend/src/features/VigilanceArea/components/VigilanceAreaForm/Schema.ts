import { VigilanceArea } from '@features/VigilanceArea/types'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

import type { GeoJSON } from 'domain/types/GeoJSON'

export const DraftSchema: Yup.Schema<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived' | 'seaFront'>
> = Yup.object()
  .shape({
    comments: Yup.string().optional(),
    computedEndDate: Yup.string().nullable(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .optional(),
    endDatePeriod: Yup.string().optional(),
    endingCondition: Yup.mixed<VigilanceArea.EndingCondition>().optional(),
    endingOccurrenceDate: Yup.string().optional(),
    endingOccurrencesNumber: Yup.number().optional(),
    frequency: Yup.mixed<VigilanceArea.Frequency>().optional(),
    geom: Yup.mixed<GeoJSON.MultiPolygon>().optional(),
    id: Yup.number().optional(),
    images: Yup.array<VigilanceArea.ImagePropsForApi>().optional(),
    isArchived: Yup.boolean().required(),
    isDraft: Yup.boolean().required(),
    linkedAMPs: Yup.array().optional(),
    linkedRegulatoryAreas: Yup.array().optional(),
    links: Yup.array().optional(),
    name: Yup.string().required(),
    source: Yup.string().optional(),
    startDatePeriod: Yup.string().optional(),
    themes: Yup.array().optional(),
    visibility: Yup.mixed<VigilanceArea.Visibility>().optional()
  })
  .required()

export const PublishedSchema: Yup.Schema<
  Omit<VigilanceArea.VigilanceArea, 'computedEndDate' | 'isDraft' | 'isArchived' | 'seaFront'>
> = Yup.object()
  .shape({
    comments: Yup.string().required(),
    computedEndDate: Yup.string().nullable(),
    createdBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .required(),
    endDatePeriod: Yup.string().required(),
    endingCondition: Yup.mixed<VigilanceArea.EndingCondition>()
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
    frequency: Yup.mixed<VigilanceArea.Frequency>().oneOf(Object.values(VigilanceArea.Frequency)).required(),
    geom: Yup.mixed<GeoJSON.MultiPolygon>()
      .test({
        message: 'Veuillez définir une zone de vigilance',
        name: 'has-geom',
        test: val => val && !isEmpty(val?.coordinates)
      })
      .required(),
    id: Yup.number().optional(),
    images: Yup.array<VigilanceArea.ImagePropsForApi>().optional(),
    isArchived: Yup.boolean().required(),
    isDraft: Yup.boolean().required(),
    linkedAMPs: Yup.array().optional(),
    linkedRegulatoryAreas: Yup.array().optional(),
    links: Yup.array().optional(),
    name: Yup.string().required(),
    source: Yup.string().optional(),
    startDatePeriod: Yup.string().required(),
    themes: Yup.array().ensure().defined().min(1),
    visibility: Yup.mixed<VigilanceArea.Visibility>().oneOf(Object.values(VigilanceArea.Visibility)).required()
  })
  .required()

export const VigilanceAreaSchema = Yup.lazy(value => {
  const isMissionPublished = !value.isDraft

  if (isMissionPublished) {
    return PublishedSchema
  }

  return DraftSchema
})
