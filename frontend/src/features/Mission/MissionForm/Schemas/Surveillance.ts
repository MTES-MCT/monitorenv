import _ from 'lodash'
import * as Yup from 'yup'

import { ClosedControlPlansSchema } from './ControlPlans'
import { ActionTypeEnum, type EnvActionSurveillance } from '../../../../domain/entities/missions'
import { isCypress } from '../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'

const shouldUseAlternateValidationInTestEnvironment = !import.meta.env.PROD || isCypress()

const SurveillanceZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de surveillance',
  name: 'has-geom',
  test: val => val && !_.isEmpty(val?.coordinates)
})

export const getNewEnvActionSurveillanceSchema = (ctx: any): Yup.SchemaOf<EnvActionSurveillance> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: Yup.date()
        .nullable()
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
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.date()
        .nullable()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from[1]) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      completedBy: Yup.string().nullable(),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.object().nullable()
        : Yup.array().of(SurveillanceZoneSchema).ensure().min(1, 'Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR)
    })
    .required()

export const getCompletionEnvActionSurveillanceSchema = (ctx: any): Yup.SchemaOf<EnvActionSurveillance> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: Yup.date()
        .nullable()
        .required(HIDDEN_ERROR)
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
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.date()
        .nullable()
        .required(HIDDEN_ERROR)
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR),
      controlPlans: Yup.array().ensure().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.object().nullable()
        : Yup.array().of(SurveillanceZoneSchema).ensure().min(1, 'Veuillez définir une zone de surveillance'),
      id: Yup.string().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR)
    })
    .required()
