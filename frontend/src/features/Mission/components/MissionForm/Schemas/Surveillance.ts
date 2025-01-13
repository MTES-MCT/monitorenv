import * as Yup from 'yup'

import { ClosedControlPlansSchema, NewControlPlansSchema } from './ControlPlans'
import { type Awareness, type EnvActionSurveillance } from '../../../../../domain/entities/missions'
import { isCypress } from '../../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'
import { actionEndDateValidation, actionStartDateValidation } from './ActionDates'

import type { ControlPlansData } from 'domain/entities/controlPlan'
import type { GeoJSON } from 'domain/types/GeoJSON'

const shouldUseAlternateValidationInTestEnvironment = !import.meta.env.PROD || isCypress()

export const getNewEnvActionSurveillanceSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionSurveillance, 'actionType' | 'completion' | 'reportingIds'>> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: actionEndDateValidation(ctx),
      actionStartDateTimeUtc: actionStartDateValidation(ctx),
      awareness: Yup.object<Awareness>().shape({
        isRisingAwareness: Yup.boolean().optional(),
        nbPerson: Yup.number().optional(),
        themeId: Yup.number().optional()
      }),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      controlPlans: Yup.array<ControlPlansData>().of(NewControlPlansSchema).optional(),
      durationMatchesMission: Yup.boolean().optional(),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .required(HIDDEN_ERROR)
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
      controlPlans: Yup.array().ensure().of(ClosedControlPlansSchema).ensure().required().min(1),
      durationMatchesMission: Yup.boolean().optional(),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR)
    })
    .required()
