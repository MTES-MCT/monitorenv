import _ from 'lodash'
import * as Yup from 'yup'

import { ClosedControlPlansSchema } from './ControlPlans'
import { CompletionInfractionSchema, NewInfractionSchema } from './Infraction'
import { ActionTypeEnum, type EnvActionControl } from '../../../../domain/entities/missions'
import { TargetTypeEnum } from '../../../../domain/entities/targetType'
import { isCypress } from '../../../../utils/isCypress'
import { HIDDEN_ERROR } from '../constants'

const shouldUseAlternateValidationInTestEnvironment = !import.meta.env.PROD || isCypress()

const ControlPointSchema = Yup.object().test({
  message: 'Point de contrôle requis',
  name: 'has-geom',
  test: val => val && !_.isEmpty(val?.coordinates)
})

export const getNewEnvActionControlSchema = (ctx: any, nbTargetMax: number): Yup.SchemaOf<EnvActionControl> =>
  Yup.object()
    .shape({
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .test({
          message: 'La date doit être postérieure à celle de début de mission',
          test: value => {
            if (!ctx.from) {
              return true
            }

            return value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
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
      actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
      completedBy: Yup.string().nullable(),
      id: Yup.string().required(),
      infractions: Yup.array().of(NewInfractionSchema(nbTargetMax)).ensure().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR)
    })
    .nullable()
    .required()

export const getCompletionEnvActionControlSchema = (ctx: any, nbTargetMax: number): Yup.SchemaOf<EnvActionControl> =>
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

            return value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true
          }
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
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
      actionTargetType: Yup.string().nullable().required('Requis'),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
      completedBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable(),
      controlPlans: Yup.array().of(ClosedControlPlansSchema).ensure().required().min(1),
      geom: shouldUseAlternateValidationInTestEnvironment
        ? Yup.object().nullable()
        : Yup.array().of(ControlPointSchema).ensure().min(1, 'Point de contrôle requis'),
      id: Yup.string().required(),
      infractions: Yup.array().of(CompletionInfractionSchema(nbTargetMax)).ensure().required(),
      openBy: Yup.string()
        .min(3, 'Minimum 3 lettres pour le trigramme')
        .max(3, 'Maximum 3 lettres pour le trigramme')
        .nullable()
        .required(HIDDEN_ERROR),
      vehicleType: Yup.string().when('actionTargetType', (actionTargetType, schema) => {
        if (!actionTargetType || actionTargetType === TargetTypeEnum.VEHICLE) {
          return schema.nullable().required('Requis')
        }

        return schema.nullable()
      })
    })
    .nullable()
