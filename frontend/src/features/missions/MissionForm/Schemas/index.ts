import _ from 'lodash'
import * as Yup from 'yup'

import { getClosedEnvActionControlSchema, getNewEnvActionControlSchema } from './Control'
import { getClosedEnvActionSurveillanceSchema, getNewEnvActionSurveillanceSchema } from './Surveillance'
import { ActionTypeEnum, EnvActionNote, MissionTypeEnum, NewMission } from '../../../../domain/entities/missions'
import { REACT_APP_CYPRESS_TEST } from '../../../../env'

import type { ControlResource, ControlUnit } from '../../../../domain/entities/controlUnit'

const shouldUseAlternateValidationInTestEnvironment = process.env.NODE_ENV === 'development' || REACT_APP_CYPRESS_TEST

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
    contact: Yup.string()
      .nullable()
      .test({
        message: 'Requis',
        name: 'controlUnits contact',
        test: (value, context) => {
          if (!value && context.path === 'controlUnits[0].contact') {
            return false
          }

          return true
        }
      }),
    id: Yup.number().required(),
    name: Yup.string().required(),
    resources: Yup.array().ensure().of(ControlResourceSchema).required()
  })
  .defined()

const ClosedControlUnitSchema: Yup.SchemaOf<ControlUnit> = ControlUnitSchema.shape({
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

const ClosedEnvActionSchema = Yup.lazy((value, context) => {
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

const MissionZoneSchema = Yup.object().test({
  message: 'Veuillez définir une zone de mission',
  name: 'has-geom',
  test: val => val && !_.isEmpty(val?.coordinates)
})

const NewMissionSchema: Yup.SchemaOf<NewMission> = Yup.object()
  .shape({
    closedBy: Yup.string().nullable(),
    controlUnits: Yup.array().of(ControlUnitSchema).ensure().defined().min(1),
    endDateTimeUtc: Yup.date()
      .nullable()
      .min(Yup.ref('startDateTimeUtc'), () => 'La date de fin doit être postérieure à la date de début')
      .required('Date de fin requise'),
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
      .nullable()
      .required('Trigramme requis'),
    startDateTimeUtc: Yup.date().required('Date de début requise')
  })
  .required()

const ClosedMissionSchema = NewMissionSchema.shape({
  closedBy: Yup.string()
    .min(3, 'Minimum 3 lettres pour le Trigramme')
    .max(3, 'Maximum 3 lettres pour le Trigramme')
    .nullable()
    .required('Trigramme requis'),
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
