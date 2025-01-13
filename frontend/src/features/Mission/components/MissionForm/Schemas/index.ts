import { getIsMissionEnded } from '@features/Mission/utils'
import * as Yup from 'yup'

import { getCompletionEnvActionControlSchema, getNewEnvActionControlSchema } from './Control'
import { getCompletionEnvActionSurveillanceSchema, getNewEnvActionSurveillanceSchema } from './Surveillance'
import { ActionTypeEnum, type EnvActionNote, type NewMission } from '../../../../../domain/entities/missions'
import { HIDDEN_ERROR } from '../constants'

import type { LegacyControlUnitForm } from '../../../../../domain/entities/legacyControlUnit'
import type { GeoJSON } from 'domain/types/GeoJSON'

const ControlResourceSchema = Yup.object()
  .shape({
    id: Yup.number().required(),
    name: Yup.string().required()
  })
  .required()

const ControlUnitSchema: Yup.Schema<LegacyControlUnitForm> = Yup.object()
  .shape({
    administration: Yup.string().required('Administration requise'),
    contact: Yup.string().optional(),
    id: Yup.number().required(),
    isArchived: Yup.boolean().required(),
    name: Yup.string().required('Unité requise'),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const EnvActionNoteSchema: Yup.Schema<Omit<EnvActionNote, 'actionType'>> = Yup.object()
  .shape({
    actionStartDateTimeUtc: Yup.string().required('Requis'),
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

  return Yup.array().required()
})

export const CompletionEnvActionSchema = Yup.lazy((value, context) => {
  if (value.actionType === ActionTypeEnum.CONTROL) {
    return getCompletionEnvActionControlSchema(context)
  }
  if (value.actionType === ActionTypeEnum.SURVEILLANCE) {
    return getCompletionEnvActionSurveillanceSchema(context)
  }
  if (value.actionType === ActionTypeEnum.NOTE) {
    return EnvActionNoteSchema
  }

  return Yup.object().required()
})

export const NewMissionSchema: Yup.ObjectSchema<
  Omit<
    NewMission,
    | 'attachedReportingIds'
    | 'attachedReportings'
    | 'createdAtUtc'
    | 'detachedReportingIds'
    | 'detachedReportings'
    | 'facade'
    | 'fishActions'
    | 'hasMissionOrder'
    | 'hasRapportNavActions'
    | 'id'
    | 'isGeometryComputedFromControls'
    | 'isUnderJdp'
    | 'missionSource'
    | 'updatedAtUtc'
    | 'envActions'
  >
> = Yup.object()
  .shape({
    completedBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .optional(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.string()
      .nullable()
      .test({
        message: 'La date de fin doit être postérieure à la date de début',
        test: (value, context) => (value ? new Date(context.parent.startDateTimeUtc) < new Date(value) : true)
      })
      .required(HIDDEN_ERROR),
    envActions: Yup.array().of(NewEnvActionSchema).ensure(),
    geom: Yup.mixed<GeoJSON.MultiPolygon>().optional(),
    missionTypes: Yup.array().min(1).required('Type de mission requis'),
    observationsCacem: Yup.string().optional(),
    observationsCnsp: Yup.string().optional(),
    openBy: Yup.string()
      .min(3, 'Minimum 3 lettres pour le trigramme')
      .max(3, 'Maximum 3 lettres pour le trigramme')
      .optional(),
    startDateTimeUtc: Yup.string().required(HIDDEN_ERROR)
  })
  .required()

const CompletionMissionSchema = NewMissionSchema.shape({
  envActions: Yup.array().of(CompletionEnvActionSchema).nullable()
})

export const MissionSchema = Yup.lazy(value => {
  const isMissionEnded = getIsMissionEnded(value.endDateTimeUtc)

  if (isMissionEnded) {
    return CompletionMissionSchema
  }

  return NewMissionSchema
})
