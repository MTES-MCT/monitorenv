import * as Yup from 'yup'

import { ClosedInfractionSchema, NewInfractionSchema } from './Infraction'
import { ThemeSchema } from './Theme'
import { ActionTypeEnum, type EnvActionControl } from '../../../../domain/entities/missions'
import { TargetTypeEnum } from '../../../../domain/entities/targetType'

export const getNewEnvActionControlSchema = (ctx: any): Yup.SchemaOf<EnvActionControl> =>
  Yup.object()
    .shape({
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .test({
          message: 'La date doit être postérieure à celle de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
      id: Yup.string().required(),
      infractions: Yup.array().of(NewInfractionSchema).ensure().required()
    })
    .nullable()
    .required()

export const getClosedEnvActionControlSchema = (ctx: any): Yup.SchemaOf<EnvActionControl> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().required('Requis'),
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .required('Date requise')
        .test({
          message: 'La date doit être postérieure à celle de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date doit être antérieure à celle de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionTargetType: Yup.string().nullable().required('Requis'),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
      geom: Yup.array().ensure().min(1, 'Requis'),
      id: Yup.string().required(),
      infractions: Yup.array().of(ClosedInfractionSchema).ensure().required(),
      themes: Yup.array().of(ThemeSchema).ensure().required(),
      vehicleType: Yup.string().when('actionTargetType', (actionTargetType, schema) => {
        if (!actionTargetType || actionTargetType === TargetTypeEnum.VEHICLE) {
          return schema.nullable().required('Requis')
        }

        return schema.nullable()
      })
    })
    .nullable()
