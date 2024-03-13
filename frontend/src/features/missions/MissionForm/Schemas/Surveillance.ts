import _ from 'lodash'
import * as Yup from 'yup'

import { ClosedControlPlansSchema } from './ControlPlans'
import { ActionTypeEnum, type EnvActionSurveillance } from '../../../../domain/entities/missions'
import { isCypress } from '../../../../utils/isCypress'

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
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date de fin doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.date()
        .nullable()
        .required('_')
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      id: Yup.string().required()
    })
    .required()

export const getClosedEnvActionSurveillanceSchema = (ctx: any): Yup.SchemaOf<EnvActionSurveillance> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: Yup.date()
        .nullable()
        .required('_')
        .test({
          message: 'La date de fin doit être postérieure à celle de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date de fin doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        })
        .min(Yup.ref('actionStartDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
      actionStartDateTimeUtc: Yup.date()
        .nullable()
        .required('_')
        .test({
          message: 'La date de début doit être postérieure à celle de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date de début doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      controlPlans: Yup.array().ensure().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: Yup.object().when('coverMissionZone', {
        is: true,
        otherwise: () =>
          shouldUseAlternateValidationInTestEnvironment
            ? Yup.object().nullable()
            : Yup.array().of(SurveillanceZoneSchema).ensure().min(1, 'Veuillez définir une zone de surveillance'),

        then: () => Yup.object().nullable()
      }),
      id: Yup.string().required()
    })
    .required()
