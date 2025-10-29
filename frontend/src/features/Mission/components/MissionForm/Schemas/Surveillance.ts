import * as Yup from 'yup'

import { type Awareness, type EnvActionSurveillance } from '../../../../../domain/entities/missions'
import { HIDDEN_ERROR } from '../constants'
import { actionEndDateValidation, actionStartDateValidation } from './ActionDates'

import type { GeoJSON } from 'domain/types/GeoJSON'

export const getNewEnvActionSurveillanceSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionSurveillance, 'actionType' | 'completion' | 'reportingIds'>> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: actionEndDateValidation(ctx),
      actionStartDateTimeUtc: actionStartDateValidation(ctx),
      awareness: Yup.object<Awareness>().shape({
        details: Yup.array()
          .of(
            Yup.object().shape({
              nbPerson: Yup.number().required('Le nombre de personnes informées est requis'),
              themeId: Yup.number().required('Le thème est obligatoire')
            })
          )
          .when('isRisingAwareness', {
            is: (value: boolean) => value === true,
            otherwise: schema => schema.min(0),
            then: schema => schema.min(1, 'Les informations sont requises')
          }),
        isRisingAwareness: Yup.boolean().optional()
      }),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      durationMatchesMission: Yup.boolean().optional(),
      geom: Yup.mixed<GeoJSON.MultiPolygon>().required('Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .required(HIDDEN_ERROR),
      tags: Yup.array().ensure().optional(),
      themes: Yup.array().ensure().optional()
    })
    .required()

export const getCompletionEnvActionSurveillanceSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionSurveillance, 'actionType' | 'completion' | 'reportingIds'>> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: actionEndDateValidation(ctx).required(HIDDEN_ERROR),
      actionStartDateTimeUtc: actionStartDateValidation(ctx).required(HIDDEN_ERROR),
      awareness: Yup.object<Awareness>().shape({
        isRisingAwareness: Yup.boolean().optional(),
        nbPerson: Yup.number().optional(),
        themeId: Yup.number().optional()
      }),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      durationMatchesMission: Yup.boolean().optional(),
      geom: Yup.mixed<GeoJSON.MultiPolygon>().required('Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR),
      tags: Yup.array().ensure().optional(),
      themes: Yup.array().ensure().required().min(1)
    })
    .required()
