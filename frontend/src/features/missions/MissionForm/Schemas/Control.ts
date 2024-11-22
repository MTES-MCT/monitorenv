import * as Yup from 'yup'

import { ClosedControlPlansSchema, NewControlPlansSchema } from './ControlPlans'
import { CompletionInfractionSchema, NewInfractionSchema } from './Infraction'
import { type EnvActionControl, type NewEnvActionControl } from '../../../../domain/entities/missions'
import { TargetTypeEnum } from '../../../../domain/entities/targetType'
import { isCypress } from '../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'

import type { VehicleTypeEnum } from 'domain/entities/vehicleType'
import type { GeoJSON } from 'domain/types/GeoJSON'

const shouldUseAlternateValidationInTestEnvironment = !import.meta.env.PROD || isCypress()

export const getNewEnvActionControlSchema = (
  ctx: any
): Yup.Schema<Omit<NewEnvActionControl, 'actionEndDateTimeUtc' | 'completion' | 'reportingIds' | 'actionType'>> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().optional(),
      actionStartDateTimeUtc: Yup.string()
        .optional()
        .test({
          message: 'La date doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? new Date(value) >= new Date(ctx.from[0].value.startDateTimeUtc) : true
          }
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? new Date(value) <= new Date(ctx.from[0].value.endDateTimeUtc) : true
          }
        }),
      actionTargetType: Yup.string<TargetTypeEnum>().optional(),
      completedBy: Yup.string().optional(),
      controlPlans: Yup.array().of(NewControlPlansSchema).optional(),
      geom: Yup.mixed<GeoJSON.MultiPolygon | GeoJSON.MultiPoint>().optional(),
      id: Yup.string().required(),
      infractions: Yup.array().of(NewInfractionSchema).ensure().optional(),
      isAdministrativeControl: Yup.boolean().optional(),
      isComplianceWithWaterRegulationsControl: Yup.boolean().optional(),
      isSafetyEquipmentAndStandardsComplianceControl: Yup.boolean().optional(),
      isSeafarersControl: Yup.boolean().optional(),
      observations: Yup.string().optional(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .required(HIDDEN_ERROR),
      vehicleType: Yup.string().optional()
    })
    .required()

export const getCompletionEnvActionControlSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionControl, 'actionEndDateTimeUtc' | 'completion' | 'reportingIds' | 'actionType'>> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().required('Requis'),
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? new Date(value) >= new Date(ctx.from[0].value.startDateTimeUtc) : true
          }
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? new Date(value) <= new Date(ctx.from[0].value.endDateTimeUtc) : true
          }
        }),
      actionTargetType: Yup.string<TargetTypeEnum>().required('Requis'),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      controlPlans: Yup.array().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Requis'),
      id: Yup.string().required(),
      infractions: Yup.array().of(CompletionInfractionSchema).ensure().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR),
      vehicleType: Yup.string<VehicleTypeEnum>().test({
        message: 'Type de véhicule requis',
        test: (_, context) => {
          if (context.parent.actionTargetType === TargetTypeEnum.VEHICLE || !context.parent.actionTargetType) {
            return false
          }

          return true
        }
      })
    })
    .required()
