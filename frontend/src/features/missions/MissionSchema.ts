import _ from 'lodash'
import * as Yup from 'yup'

import {
  ActionTargetTypeEnum,
  ActionTypeEnum,
  EnvActionControl,
  EnvActionNote,
  EnvActionSurveillance,
  EnvActionTheme,
  FormalNoticeEnum,
  Infraction,
  InfractionTypeEnum,
  MissionTypeEnum,
  NewMission,
  VesselSizeEnum,
  VesselTypeEnum
} from '../../domain/entities/missions'
import { REACT_APP_CYPRESS_TEST } from '../../env'

import type { ControlResource, ControlUnit } from '../../domain/entities/controlUnit'

const shouldUseAlternateValidationInTestEnvironment = process.env.NODE_ENV === 'development' || REACT_APP_CYPRESS_TEST

Yup.addMethod(Yup.mixed, 'oneOfOptional', (arr, message) =>
  Yup.mixed().test({
    exclusive: true,
    message,
    name: 'oneOfOptional',
    params: {},
    test(value) {
      return value == null ? true : arr.includes(value)
    }
  })
)

const MissionTypesSchema = Yup.array()
  .of(Yup.mixed<MissionTypeEnum>().oneOf(Object.values(MissionTypeEnum)).required())
  .ensure()
  .min(1, 'Requis')

const ControlResourceSchema: Yup.SchemaOf<ControlResource> = Yup.object()
  .shape({
    id: Yup.number().required(),
    name: Yup.string().required()
  })
  .required()

const ControlUnitSchema: Yup.SchemaOf<ControlUnit> = Yup.object()
  .shape({
    administration: Yup.string().required(),
    contact: Yup.string().nullable().required('Requis'),
    id: Yup.number().required(),
    name: Yup.string().required(),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const ClosedControlUnitSchema: Yup.SchemaOf<ControlUnit> = Yup.object()
  .shape({
    administration: Yup.string().required(),
    contact: Yup.string().nullable().notRequired(),
    id: Yup.number().required(),
    name: Yup.string().required(),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const ThemeSchema: Yup.SchemaOf<EnvActionTheme> = Yup.object().shape({
  protectedSpecies: Yup.array().of(Yup.string().optional()).nullable().optional(),
  subThemes: Yup.array()
    .of(Yup.string().required().default(''))
    .ensure()
    .required()
    .min(1, 'Sélectionnez au moins une sous thématique'),
  theme: Yup.string().required('Sélectionnez un thême')
})

const NewInfractionSchema: Yup.SchemaOf<Infraction> = Yup.object().shape({
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required('Requis'),
  id: Yup.string().required(),
  infractionType: Yup.mixed().oneOf(Object.values(InfractionTypeEnum)).required('Requis'),
  natinf: Yup.array()
    .of(Yup.string().ensure())
    .when('infractionType', {
      is: InfractionTypeEnum.WAITING,
      otherwise: schema => schema.compact().min(1, 'Sélectionnez au moins une infraction'),
      then: schema => schema.compact().min(0)
    }),
  observations: Yup.string().nullable(),
  registrationNumber: Yup.string().nullable(),
  relevantCourt: Yup.string().nullable(),
  toProcess: Yup.boolean().required('Requis'),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselSize: Yup.mixed().oneOfOptional(Object.values(VesselSizeEnum)),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselType: Yup.mixed().oneOfOptional(Object.values(VesselTypeEnum))
})

const ClosedInfractionSchema: Yup.SchemaOf<Infraction> = Yup.object()
  .concat(NewInfractionSchema)
  .shape({
    formalNotice: Yup.mixed().oneOf([FormalNoticeEnum.YES, FormalNoticeEnum.NO]).required('Requis'),
    infractionType: Yup.mixed()
      .oneOf([InfractionTypeEnum.WITH_REPORT, InfractionTypeEnum.WITHOUT_REPORT])
      .required('Requis')
  })

const NewEnvActionControlSchema: Yup.SchemaOf<EnvActionControl> = Yup.object()
  .shape({
    actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
    id: Yup.string().required(),
    infractions: Yup.array().of(NewInfractionSchema).ensure().required()
  })
  .nullable()
  .required()

const getEnvActionControlSchema = (ctx: any): Yup.SchemaOf<EnvActionControl> =>
  Yup.object()
    .shape({
      actionNumberOfControls: Yup.number().required('Requis'),
      actionStartDateTimeUtc: Yup.string()
        .nullable()
        .required('Requis')
        .test({
          message: 'La date doit être postérieure à la date de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date doit être antérieure à la date de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionTargetType: Yup.string().nullable().required('Requis'),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
      geom: Yup.array().ensure(),
      id: Yup.string().required(),
      infractions: Yup.array().of(ClosedInfractionSchema).ensure().required(),
      themes: Yup.array().of(ThemeSchema).ensure().required(),
      vehicleType: Yup.string().when('actionTargetType', (actionTargetType, schema) => {
        if (!actionTargetType || actionTargetType === ActionTargetTypeEnum.VEHICLE) {
          return schema.nullable().required('Requis')
        }

        return schema.nullable()
      })
    })
    .nullable()
    .required()

const getEnvActionSurveillanceSchema = (ctx: any): Yup.SchemaOf<EnvActionSurveillance> =>
  Yup.object()
    .shape({
      actionEndDateTimeUtc: Yup.date()
        .nullable()
        .required('Requis')
        .test({
          message: 'La date doit être postérieure à la date de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date doit être antérieure à la date de fin de mission',
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
        .required('Requis')
        .test({
          message: 'La date doit être postérieure à la date de début de mission',
          test: value => (value ? !(new Date(value) < new Date(ctx.from[1].value.startDateTimeUtc)) : true)
        })
        .test({
          message: 'La date doit être antérieure à la date de fin de mission',
          test: value => {
            if (!ctx.from[1].value.endDateTimeUtc) {
              return true
            }

            return value ? !(new Date(value) > new Date(ctx.from[1].value.endDateTimeUtc)) : true
          }
        }),
      actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
      geom: Yup.array().ensure(),
      id: Yup.string().required(),
      themes: Yup.array().of(ThemeSchema).ensure().required()
    })
    .required()

const NewEnvActionSurveillanceSchema: Yup.SchemaOf<EnvActionSurveillance> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().nullable().required('Requis'),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
    id: Yup.string().required()
  })
  .required()

const EnvActionNoteSchema: Yup.SchemaOf<EnvActionNote> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().required('Requis'),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.NOTE]),
    id: Yup.string().required()
  })
  .required()

const NewEnvActionSchema = Yup.lazy(value => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return NewEnvActionControlSchema
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return NewEnvActionSurveillanceSchema
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return Yup.object().required()
})

const ClosedEnvActionSchema = Yup.lazy((value, context) => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return getEnvActionControlSchema(context)
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return getEnvActionSurveillanceSchema(context)
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return Yup.object().required()
})

const MissionZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de mission',
  name: 'has-geom',
  test: val => val && !_.isEmpty(val?.coordinates)
})

const NewMissionSchema: Yup.SchemaOf<NewMission> = Yup.object()
  .shape({
    closedBy: Yup.string(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.date()
      .nullable()
      .min(Yup.ref('startDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début'),
    // cast as any to avoid type error
    // FIXME : see issue https://github.com/jquense/yup/issues/1190
    // & tip for resolution https://github.com/jquense/yup/issues/1283#issuecomment-786559444
    envActions: Yup.array()
      .of(NewEnvActionSchema as any)
      .nullable(),
    geom: shouldUseAlternateValidationInTestEnvironment ? Yup.object().nullable() : MissionZoneSchema,
    isClosed: Yup.boolean().oneOf([false]).required(),
    missionTypes: MissionTypesSchema,
    openBy: Yup.string()
      .min(3, 'le Trigramme doit comporter 3 lettres')
      .max(3, 'le Trigramme doit comporter 3 lettres')
      .required('Requis'),
    startDateTimeUtc: Yup.date().required('Requis')
  })
  .required()

const ClosedMissionSchema = NewMissionSchema.shape({
  controlUnits: Yup.array().of(ClosedControlUnitSchema).ensure().defined().min(1),
  endDateTimeUtc: Yup.date()
    .nullable()
    .min(Yup.ref('startDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début')
    .required('Requis'),
  envActions: Yup.array()
    .of(ClosedEnvActionSchema as any)
    .nullable(),
  isClosed: Yup.boolean().oneOf([true]).required()
})

export const MissionSchema = Yup.lazy(value => {
  if (value.isClosed) {
    return ClosedMissionSchema
  }

  return NewMissionSchema
})
