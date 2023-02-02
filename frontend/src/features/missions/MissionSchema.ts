import _ from 'lodash'
import * as Yup from 'yup'

import {
  ActionTypeEnum,
  EnvActionControl,
  EnvActionNote,
  EnvActionSurveillance,
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

const MissionTypeSchema = Yup.mixed<MissionTypeEnum>().oneOf(Object.values(MissionTypeEnum)).required()

const MissionNatureSchema = Yup.array()
  .of(Yup.mixed<MissionNatureEnum>().oneOf(Object.values(MissionNatureEnum)).required())
  .ensure()
  .min(1, ' ')

const ControlResourceSchema: Yup.SchemaOf<ControlResource> = Yup.object()
  .shape({
    id: Yup.number().required(),
    name: Yup.string().required()
  })
  .required()

const ControlUnitSchema: Yup.SchemaOf<ControlUnit> = Yup.object()
  .shape({
    administration: Yup.string().required(),
    contact: Yup.string().required(),
    id: Yup.number().required(),
    name: Yup.string().required(),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const InfractionSchema: Yup.SchemaOf<Infraction> = Yup.object().shape({
  companyName: Yup.string().optional(),
  controlledPersonIdentity: Yup.string(),
  formalNotice: Yup.mixed().oneOf(Object.values(FormalNoticeEnum)).required(),
  id: Yup.string().required(),
  infractionType: Yup.mixed().oneOf(Object.values(InfractionTypeEnum)).required(),
  natinf: Yup.array().of(Yup.string().ensure()).compact().ensure(),
  observations: Yup.string(),
  registrationNumber: Yup.string(),
  relevantCourt: Yup.string(),
  toProcess: Yup.boolean().required(),
  vesselSize: Yup.mixed().oneOf(Object.values(VesselSizeEnum)),
  vesselType: Yup.mixed().oneOf(Object.values(VesselTypeEnum))
})

const EnvActionControlSchema: Yup.SchemaOf<EnvActionControl> = Yup.object()
  .shape({
    actionNumberOfControls: Yup.number().required(),
    actionStartDateTimeUtc: Yup.string().required(),
    actionSubTheme: Yup.string(),
    actionTargetType: Yup.string(),
    actionTheme: Yup.string(),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.CONTROL]),
    geom: Yup.array().ensure(),
    id: Yup.string().required(),
    infractions: Yup.array().of(InfractionSchema).ensure().required(),
    protectedSpecies: Yup.string(),
    vehicleType: Yup.string()
  })
  .required()

const EnvActionSurveillanceSchema: Yup.SchemaOf<EnvActionSurveillance> = Yup.object()
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
  test: ({ coordinates }) => !_.isEmpty(coordinates)
})

export const MissionSchema: Yup.SchemaOf<NewMission> = Yup.object()
  .shape({
    closedBy: Yup.string().defined(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    // FIXME : see issue https://github.com/jquense/yup/issues/1190 & tip for resolution https://github.com/jquense/yup/issues/1283#issuecomment-786559444
    envActions: Yup.array().of(EnvActionSchema as any),
    geom: MissionZoneSchema,
    isClosed: Yup.boolean().default(false),
    missionNature: MissionNatureSchema,
    missionType: MissionTypeSchema,
    openBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le Trigramme')
      .max(3, 'Maximum 3 lettres pour le Trigramme')
      .required('Requis'),
    startDateTimeUtc: Yup.string().required('Requis')
  })
  .required()
