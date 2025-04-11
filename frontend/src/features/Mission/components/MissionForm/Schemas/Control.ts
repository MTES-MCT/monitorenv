import * as Yup from 'yup'

import { ClosedControlPlansSchema, NewControlPlansSchema } from './ControlPlans'
import { CompletionInfractionSchema, NewInfractionSchema } from './Infraction'
import { type EnvActionControl, type NewEnvActionControl } from '../../../../../domain/entities/missions'
import { TargetTypeEnum } from '../../../../../domain/entities/targetType'
import { isCypress } from '../../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'
import { actionStartDateValidation } from './ActionDates'

import type { GeoJSON } from 'domain/types/GeoJSON'

const isLocalOrCypressEnvironnment = !import.meta.env.PROD || isCypress()

export const getNewEnvActionControlSchema = (
  ctx: any
): Yup.Schema<Omit<NewEnvActionControl, 'actionEndDateTimeUtc' | 'completion' | 'reportingIds' | 'actionType'>> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().optional(),
      actionStartDateTimeUtc: actionStartDateValidation(ctx, true),
      actionTargetType: Yup.string<TargetTypeEnum>().optional(),
      completedBy: Yup.string().optional(),
      controlPlans: Yup.array().of(NewControlPlansSchema).optional(),
      geom: Yup.mixed<GeoJSON.MultiPolygon | GeoJSON.MultiPoint>().optional(),
      id: Yup.string().required(),
      infractions: Yup.array().of(NewInfractionSchema).ensure().default([]),
      isAdministrativeControl: Yup.boolean().optional(),
      isComplianceWithWaterRegulationsControl: Yup.boolean().optional(),
      isSafetyEquipmentAndStandardsComplianceControl: Yup.boolean().optional(),
      isSeafarersControl: Yup.boolean().optional(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .required(HIDDEN_ERROR)
      // tags: Yup.array().ensure().optional(),
      // themes: Yup.array().ensure().optional()
    })
    .required()

export const getCompletionEnvActionControlSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionControl, 'actionEndDateTimeUtc' | 'completion' | 'reportingIds' | 'actionType'>> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().required('Requis'),
      actionStartDateTimeUtc: actionStartDateValidation(ctx).required(HIDDEN_ERROR),
      actionTargetType: Yup.string<TargetTypeEnum>().required('Requis'),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      controlPlans: Yup.array().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: isLocalOrCypressEnvironnment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Requis'),
      id: Yup.string().required(),
      infractions: Yup.array().of(CompletionInfractionSchema).ensure().required(),
      isAdministrativeControl: Yup.boolean().optional(),
      isComplianceWithWaterRegulationsControl: Yup.boolean().optional(),
      isSafetyEquipmentAndStandardsComplianceControl: Yup.boolean().optional(),
      isSeafarersControl: Yup.boolean().optional(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR),
      // tags: Yup.array().ensure().required().min(1),
      // themes: Yup.array().ensure().required().min(1),
      vehicleType: Yup.string().when('actionTargetType', (actionTargetType, schema) => {
        // TODO(22/11/2024): fix actionTargetType which is an array and not a string
        if (actionTargetType.includes(TargetTypeEnum.COMPANY) || actionTargetType.includes(TargetTypeEnum.INDIVIDUAL)) {
          return schema.nullable()
        }

        return schema.nullable().required('Requis')
      })
    })
    .required()
