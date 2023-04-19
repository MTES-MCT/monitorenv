import _ from 'lodash'
import * as Yup from 'yup'

import {
  actionTargetTypeEnum,
  ActionTypeEnum,
  EnvActionControl,
  EnvActionNote,
  EnvActionSurveillance,
  EnvActionTheme,
  FormalNoticeEnum,
  Infraction,
  InfractionTypeEnum,
  MissionNatureEnum,
  MissionTypeEnum,
  NewMission,
  VesselSizeEnum,
  VesselTypeEnum
} from '../../domain/entities/missions'

import type { ControlResource, ControlUnit } from '../../domain/entities/controlUnit'

const shouldUseAlternateValidationInTestEnvironment = process.env.NODE_ENV === 'development'

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

const MissionNatureSchema = Yup.array()
  .of(Yup.mixed<MissionNatureEnum>().oneOf(Object.values(MissionNatureEnum)).required())
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
    contact: Yup.string().required('Requis').nullable(),
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

const InfractionSchema: Yup.SchemaOf<Infraction> = Yup.object().shape({
  companyName: Yup.string().optional().nullable(),
  controlledPersonIdentity: Yup.string().nullable(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  infractionType: Yup.mixed().oneOf(Object.values(InfractionTypeEnum)).required(),
  natinf: Yup.array().of(Yup.string().ensure()).compact().min(1),
  observations: Yup.string(),
  registrationNumber: Yup.string().nullable(),
  relevantCourt: Yup.string().nullable(),
  toProcess: Yup.boolean().required(),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselSize: Yup.mixed().oneOfOptional(Object.values(VesselSizeEnum)),
  // @ts-ignore
  // Property 'oneOfOptional' does not exist on type 'MixedSchema<any, AnyObject, any>'
  vesselType: Yup.mixed().oneOfOptional(Object.values(VesselTypeEnum))
})

const EnvActionControlSchema: Yup.SchemaOf<EnvActionControl> = Yup.object()
  .shape({
    actionNumberOfControls: Yup.number().required('Requis'),
    actionStartDateTimeUtc: Yup.string().required('Requis').nullable(),
    actionTargetType: Yup.string().required('Requis').nullable(),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
    geom: Yup.array().ensure(),
    id: Yup.string().required(),
    infractions: Yup.array().of(InfractionSchema).ensure().required(),
    protectedSpecies: Yup.array().of(Yup.string()),
    themes: Yup.array().of(ThemeSchema).ensure().required(),
    vehicleType: Yup.string().when('actionTargetType', (actionTargetType, schema) => {
      if (!actionTargetType || actionTargetType === actionTargetTypeEnum.VEHICLE.code) {
        return schema.nullable().required('Requis')
      }

      return schema.nullable()
    })
  })
  .required()

const EnvActionSurveillanceSchema: Yup.SchemaOf<EnvActionSurveillance> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().required('Requis').nullable(),
    actionSubTheme: Yup.string().nullable(),
    actionTheme: Yup.string().nullable(),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
    geom: Yup.array().ensure(),
    id: Yup.string().required(),
    protectedSpecies: Yup.string()
  })
  .required()

const EnvActionNoteSchema: Yup.SchemaOf<EnvActionNote> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().required(),
    actionSubTheme: Yup.string(),
    actionTheme: Yup.string(),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.SURVEILLANCE]),
    geom: Yup.array().ensure(),
    id: Yup.string().required(),
    protectedSpecies: Yup.string()
  })
  .required()

export const EnvActionSchema = Yup.lazy(value => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return EnvActionControlSchema
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return EnvActionSurveillanceSchema
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return EnvActionControlSchema
})

export const EnvActions = Yup.array().of(EnvActionSurveillanceSchema)

export const MissionZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de mission',
  name: 'has-geom',
  test: val => val && !_.isEmpty(val?.coordinates)
})

export const NewMissionSchema: Yup.SchemaOf<NewMission> = Yup.object()
  .shape({
    closedBy: Yup.string(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.string().nullable(),
    // FIXME : see issue https://github.com/jquense/yup/issues/1190
    // & tip for resolution https://github.com/jquense/yup/issues/1283#issuecomment-786559444
    envActions: Yup.array().of(EnvActionSchema as any),
    geom: shouldUseAlternateValidationInTestEnvironment ? Yup.object().nullable() : MissionZoneSchema,
    isClosed: Yup.boolean().default(false),
    missionNature: MissionNatureSchema,
    missionTypes: MissionTypesSchema,
    openBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le Trigramme')
      .max(3, 'Maximum 3 lettres pour le Trigramme')
      .required('Requis'),
    startDateTimeUtc: Yup.string().required('Requis')
  })
  .required()

export const ClosedMissionSchema = Yup.object()
  .shape({
    closedBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le Trigramme')
      .max(3, 'Maximum 3 lettres pour le Trigramme')
      .required('Requis'),
    endDateTimeUtc: Yup.string().required()
  })
  .concat(NewMissionSchema)

export const MissionSchema = Yup.lazy(mission => {
  if (mission.isClosed) {
    return ClosedMissionSchema
  }

  return NewMissionSchema
})
