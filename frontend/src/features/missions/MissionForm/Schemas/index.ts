import * as Yup from 'yup'

import { getClosedEnvActionControlSchema, getNewEnvActionControlSchema } from './Control'
import { getClosedEnvActionSurveillanceSchema, getNewEnvActionSurveillanceSchema } from './Surveillance'
import {
  ActionTypeEnum,
  type EnvActionNote,
  MissionTypeEnum,
  type NewMission
} from '../../../../domain/entities/missions'
import { HIDDEN_ERROR } from '../constants'

import type { ControlUnit } from '../../../../domain/entities/controlUnit'
import type { LegacyControlUnit } from '../../../../domain/entities/legacyControlUnit'

const MissionTypesSchema = Yup.array()
  .of(Yup.mixed<MissionTypeEnum>().oneOf(Object.values(MissionTypeEnum)).required())
  .ensure()
  .min(1, 'Type de mission requis')

const ControlResourceSchema: Yup.SchemaOf<ControlUnit.ControlUnitResource> = Yup.object()
  .shape({
    id: Yup.number().required(),
    name: Yup.string().required()
  })
  .required()

const ControlUnitSchema: Yup.SchemaOf<LegacyControlUnit> = Yup.object()
  .shape({
    administration: Yup.string().required('Administration requise'),
    contact: Yup.string().nullable(),
    id: Yup.number().required(),
    name: Yup.string().required('Unité requise'),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const ClosedControlUnitSchema: Yup.SchemaOf<LegacyControlUnit> = ControlUnitSchema.shape({
  contact: Yup.string().nullable().notRequired()
}).defined()

const EnvActionNoteSchema: Yup.SchemaOf<EnvActionNote> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().required('Requis'),
    actionType: Yup.mixed().oneOf([ActionTypeEnum.NOTE]),
    id: Yup.string().required()
  })
  .required()

const NewEnvActionSchema = Yup.lazy((value, context) => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return getNewEnvActionControlSchema(context)
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return getNewEnvActionSurveillanceSchema(context)
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return Yup.object().required()
})

export const ClosedEnvActionSchema = Yup.lazy((value, context) => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return getClosedEnvActionControlSchema(context)
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return getClosedEnvActionSurveillanceSchema(context)
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return Yup.object().required()
})

const NewMissionSchema: Yup.SchemaOf<NewMission> = Yup.object()
  .shape({
    closedBy: Yup.string().nullable(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.date()
      .nullable()
      .min(Yup.ref('startDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début')
      // TODO [Missions] Delete when deploying the auto-save feature
      .required(HIDDEN_ERROR),
    // cast as any to avoid type error
    // FIXME : see issue https://github.com/jquense/yup/issues/1190
    // & tip for resolution https://github.com/jquense/yup/issues/1283#issuecomment-786559444
    envActions: Yup.array()
      .of(NewEnvActionSchema as any)
      .nullable(),
    geom: Yup.object().nullable(),
    isClosed: Yup.boolean().oneOf([false]).required(),
    missionTypes: MissionTypesSchema,
    openBy: Yup.string()
      .min(3, 'le Trigramme doit comporter 3 lettres')
      .max(3, 'le Trigramme doit comporter 3 lettres')
      .nullable()
      // TODO [Missions] Delete when deploying the auto-save feature
      .required(HIDDEN_ERROR),
    startDateTimeUtc: Yup.date().required(HIDDEN_ERROR)
  })
  .required()

const ClosedMissionSchema = NewMissionSchema.shape({
  closedBy: Yup.string()
    .min(3, 'Minimum 3 lettres pour le Trigramme')
    .max(3, 'Maximum 3 lettres pour le Trigramme')
    .nullable()
    .required(HIDDEN_ERROR),
  controlUnits: Yup.array().of(ClosedControlUnitSchema).ensure().defined().min(1),
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
