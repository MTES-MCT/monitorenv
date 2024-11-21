import * as Yup from 'yup'

import { ClosedControlPlansSchema, NewControlPlansSchema } from './ControlPlans'
import { ActionTypeEnum, type Awareness, type EnvActionSurveillance } from '../../../../domain/entities/missions'
import { isCypress } from '../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'

import type { ControlPlansData } from 'domain/entities/controlPlan'
import type { GeoJSON } from 'domain/types/GeoJSON'

const shouldUseAlternateValidationInTestEnvironment = !import.meta.env.PROD || isCypress()

export const getNewEnvActionSurveillanceSchema = (
  ctx: any
): Yup.Schema<Omit<EnvActionSurveillance, 'actionType' | 'completion' | 'reportingIds'>> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: Yup.string()
        .optional()
        .test({
          message: 'La date de fin doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de fin doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[0].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.string()
        .optional()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from[0]) {
              return true
            }

            return value ? !(new Date(value) <= new Date(ctx.from[0].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[0].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      awareness: Yup.object<Awareness>().shape({
        isRisingAwareness: Yup.boolean().optional(),
        nbPerson: Yup.number().optional(),
        themeId: Yup.number().optional()
      }),
      completedBy: Yup.string().optional(),
      controlPlans: Yup.array<ControlPlansData>().of(NewControlPlansSchema).optional(),
      durationMatchesMission: Yup.boolean().optional(),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Requis'),
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
      actionEndDateTimeUtc: Yup.string()
        .nullable()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date de fin doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[0].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de fin doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[0].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[0].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[0].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[0].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .optional(),
      controlPlans: Yup.array().ensure().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.mixed<GeoJSON.MultiPolygon>().optional()
        : Yup.mixed<GeoJSON.MultiPolygon>().required('Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR)
    })
    .required()
