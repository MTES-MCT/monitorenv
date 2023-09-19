import * as Yup from 'yup'

import { ThemeSchema } from './Theme'
import { ActionTypeEnum, EnvActionSurveillance } from '../../../../domain/entities/missions'
import { REACT_APP_CYPRESS_TEST } from '../../../../env'

const shouldUseAlternateValidationInTestEnvironment = process.env.NODE_ENV === 'development' || REACT_APP_CYPRESS_TEST

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
        .required('Date de début requise')
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
        .required('Date de fin requise')
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
        .required('Date de début requise')
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
      geom: Yup.object().when('coverMissionZone', {
        is: true,
        otherwise: () =>
          shouldUseAlternateValidationInTestEnvironment
            ? Yup.object().nullable()
            : Yup.array().ensure().min(1, 'Requis'),
        then: () => Yup.object().nullable()
      }),

      id: Yup.string().required(),
      themes: Yup.array().of(ThemeSchema).ensure().required()
    })
    .required()
